import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Habit } from "../models/habit.model.js";
import { Redisclient as RedisConn } from "../db/redis.js";

// format time of type 13:00, return hours and minutes
const GetTimeFormated = (data) => {
   let startTime = data?.split(":");
   if (startTime.length < 2) {
      return;
   }
   let hours = Number(startTime[0]);
   let minutes = Number(startTime[1]);
   return [hours, minutes];
};

// set time of hours and minutes in epoch format based on 1 jan 2025
// input time is in user local time zone, alone with user time zone offset in minutes
const GetTimeEpoch = (hr, min, userOffset) => {
   const epoch = Date.UTC(2025, 0, 1, hr, min, 0, 0) / 1000; // get epoch in seconds
   return epoch + userOffset * 60; // convert user offset in minutes to seconds
};

const listHabit = asyncHandler(async (req, res) => {
   const list = await Habit.find({ userId: req.user._id });

   return res
      .status(200)
      .json(new ApiResponse(200, list, "habit list fetched successfully"));
});

// create a new habit and add it to the list
const addHabit = asyncHandler(async (req, res) => {
   let {
      name,
      description,
      duration,
      startTime,
      endTime,
      startDate,
      endDate,
      repeat,
      place,
      how,
      ifthen,
      point,
      habitType,
      notify,
      repeatMode,
   } = req.body;
   if (!name) {
      throw new ApiError(401, "Name Feild is Reqired");
   }
   if (!habitType) {
      throw new ApiError(401, "Habit Type is Reqired");
   }
   if (startTime) {
      const [hr, min] = GetTimeFormated(startTime);
      startTime = GetTimeEpoch(hr, min, req.user.timeZone);
   }
   if (endTime) {
      const [hr, min] = GetTimeFormated(endTime);
      endTime = GetTimeEpoch(hr, min, req.user.timeZone);
      if (endTime < startTime) {
         endTime += 86400;
      }
   }
   if (startTime && endTime) {
      duration = Math.floor((endTime - startTime) / 60);
   }
   if (startDate) {
      startDate = new Date(startDate).getTime() / 1000;
      startDate = Math.ceil(startDate);
   }
   if (endDate) {
      endDate = new Date(endDate).getTime() / 1000;
      endDate = Math.ceil(endDate) + 86399;
   }
   switch (repeatMode) {
      case "days":
         repeat = repeat;
         break;
      case "dates":
         for (let i = 0; i < repeat.length; i++) {
            repeat[i] = Math.ceil(new Date(repeat[i]).getTime() / 1000);
         }
         break;
      case "hours":
         repeat = repeat;
         break;
   }
   let rep = {
      name: repeatMode,
      value: repeat,
   };
   if (habitType == "negative") {
      notify = false;
   }
   const createUserHabit = await Habit.create({
      userId: req.user._id,
      name: name,
      startDate: startDate,
      endDate: endDate,
      repeat: rep,
      habitType: habitType,
      description: description,
      duration: duration,
      startTime: startTime,
      endTime: endTime,
      place: place,
      how: how,
      ifthen: ifthen,
      point: point,
      daysCompleted: [],
      notify: notify,
   });
   if (!createUserHabit) {
      throw new ApiError(401, "Habit Creation Failed, try again later");
   }
   await RedisConn.sAdd(
      "habitLists",
      `${createUserHabit._id.toString()}:${req.user._id.toString()}`
   );
   return res
      .status(200)
      .json(new ApiResponse(200, createUserHabit, "Habit Added Successfully"));
});

// edit a habit
const editHabit = asyncHandler(async (req, res) => {
   const {
      id,
      startTime,
      endTime,
      duration,
      endDate,
      name,
      description,
      point,
      repeat,
      place,
      how,
      ifthen,
      notify,
      habitType,
   } = req.body; // habit id
   if (!id) {
      throw new ApiError(401, "Habit Id is Reqired");
   }
   const habit = await Habit.findById(id);

   if (!habit || habit.userId == req.user._id) {
      throw new ApiError(403, "Habit with Id not found for this user");
   }

   if (startTime) {
      const [hours, minutes] = GetTimeFormated(startTime);
      startTime = GetTimeEpoch(hours, minutes, req.user.timezone);
   } else {
      startTime = habit.startTime;
   }
   if (endTime) {
      const [hours, minutes] = GetTimeFormated(endTime);
      endTime = GetTimeEpoch(hours, minutes, req.user.timezone);
      if (endTime < startTime) {
         endTime += 86400;
      }
   }
   if (endDate) {
      const dat = new Date(endDate);
      endDate = Date.UTC(
         dat.getUTCFullYear(),
         dat.getUTCMonth(),
         dat.getUTCDate(),
         23,
         59,
         59,
         59
      );
   }
   if (startTime && endTime) {
      duration = Math.floor((endTime - startTime) / 60);
   }
   const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      {
         name: name,
         description: description,
         duration: duration,
         startTime: startTime,
         endTime: endTime,
         endDate: endDate,
         place: place,
         how: how,
         ifthen: ifthen,
         point: point,
         repeat: repeat,
         habitType: habitType,
         notify: notify,
      },
      { new: true }
   );
   if (!updatedHabit) {
      throw new ApiError(401, "Habit Update Failed, try again later");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, updatedHabit, "Habit updated Successfully"));
});

const DeleteHabit = asyncHandler(async (req, res) => {
   const { id } = req.body;

   if (!id) {
      throw new ApiError(401, "id is Reqired");
   }
   const del = await Habit.findOneAndDelete({ _id: id, userId: req.user._id });

   if (!del) {
      throw new ApiError(401, "Habit Deletion Failed, try again later");
   }

   await RedisConn.SREM(
      "habitLists",
      `${del._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Habit deleted Successfully"));
});

const addSteak = asyncHandler(async (req, res) => {
   const { id, habitDate } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to mark completed");
   }

   const habit = await Habit.findById(id);
   if (!habit || habit.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(401, "Habit with Id not found");
   }

   const dateTemp = new Date(habitDate || Date.now());
   const dateEpoch =
      new Date(
         dateTemp.getUTCFullYear(),
         dateTemp.getUTCMonth(),
         dateTemp.getUTCDate(),
         0,
         0,
         0,
         0
      ).getTime() / 1000;

   let check = habit.daysCompleted.find((item) => {
      if (
         item.getDate() === date.getDate() &&
         item.getMonth() === date.getMonth() &&
         item.getFullYear() === date.getFullYear()
      ) {
         return item;
      }
   });
   if (check) {
      throw new ApiError(401, "Steak is Already Marked Completed");
   }
   habit.daysCompleted.push(date);
   await habit.save();

   await RedisConn.SADD(
      `habitDate:${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`,
      `${habit._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, habit, "habit marked Completed"));
});

const removeSteak = asyncHandler(async (req, res) => {
   const { id, date: habitDate } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to add Steak");
   }

   const habit = await Habit.findById(id);
   if (!habit || habit.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(401, "Habit with Id not found");
   }

   const dateTemp = new Date(habitDate || Date.now());
   const date = new Date(
      dateTemp.getUTCFullYear(),
      dateTemp.getUTCMonth(),
      dateTemp.getUTCDate(),
      0,
      0,
      0,
      0
   );

   let check = habit.daysCompleted.filter((item) => {
      return (
         item.getDate() !== date.getDate() ||
         item.getMonth() !== date.getMonth() ||
         item.getFullYear() !== date.getFullYear()
      );
   });

   habit.daysCompleted = check;
   await habit.save();
   await RedisConn.SREM(
      `habitDate:${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`,
      `${habit._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, habit, "habit marked Pending"));
});

export { listHabit, addHabit, DeleteHabit, editHabit, addSteak, removeSteak };
