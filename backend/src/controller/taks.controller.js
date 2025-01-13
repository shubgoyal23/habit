import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Habit } from "../models/habit.model.js";
import { Redisclient as RedisConn } from "../db/redis.js";
import { Streak } from "../models/Streak.model.js";
import { User } from "../models/user.model.js";

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
      if (typeof startDate == "number") {
         startDate = startDate * 1000
      }
      startDate = new Date(startDate).getTime() / 1000;
      startDate = Math.ceil(startDate);
   }
   if (endDate) {
      if (typeof endDate == "number") {
         endDate = endDate * 1000
      }
      endDate = new Date(endDate).getTime() / 1000;
      endDate = Math.ceil(endDate) + 86399;
   }
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = Math.ceil(
               new Date(repeat.value[i]).getTime() / 1000
            );
         }
         break;
      case "hours":
         break;
   }
   if (habitType == "negative") {
      notify = false;
   }
   const createUserHabit = await Habit.create({
      userId: req.user._id,
      name: name,
      startDate: startDate,
      endDate: endDate,
      repeat: repeat,
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
   // save to user list
   const add = await User.findByIdAndUpdate(req.user._id, {
      $push: { habitsList: createUserHabit._id },
   });
   return res
      .status(200)
      .json(new ApiResponse(200, createUserHabit, "Habit Added Successfully"));
});

// edit a habit
const editHabit = asyncHandler(async (req, res) => {
   let {
      id,
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
   if (!id) {
      throw new ApiError(401, "Habit Id is Reqired");
   }
   const habit = await Habit.findById(id);

   if (!habit || habit.userId == req.user._id) {
      throw new ApiError(403, "Habit with Id not found for this user");
   }
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
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = Math.ceil(
               new Date(repeat.value[i]).getTime() / 1000
            );
         }
         break;
      case "hours":
         break;
   }
   if (habitType == "negative") {
      notify = false;
   }
   const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      {
         userId: req.user._id,
         name: name,
         startDate: startDate,
         endDate: endDate,
         repeat: repeat,
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
   const check = req.user.habitsList.find((i) => i.toString() == id);
   if (!check) {
      throw new ApiError(401, "Habit with Id not found for this user");
   }

   const del = await Habit.findOneAndDelete({ _id: id, userId: req.user._id });
   if (!del) {
      throw new ApiError(401, "Habit Deletion Failed, try again later");
   }

   const removeStreaks = await Streak.deleteMany({
      habitId: id,
   });

   let habits = req.user.habitsList.filter((i) => i.toString() != id);
   await User.findByIdAndUpdate(req.user._id, {
      $set: { habitsList: habits },
   });

   await RedisConn.SREM(
      "habitLists",
      `${del._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Habit deleted Successfully"));
});

const addStreak = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(
         401,
         "Habit Id and date is required to mark completed"
      );
   }
   const checkHabit = req.user.habitsList.find((i) => i.toString() == id);
   if (!checkHabit) {
      throw new ApiError(401, "Habit with Id not found");
   }
   const serverTime = new Date();
   const serTimeOff = serverTime.getTimezoneOffset() * 60 * 1000;
   const userTimeOff = req.user.timeZone * 60 * 1000;

   let servertime = new Date(serverTime - serTimeOff + userTimeOff);
   let dateStamp = `${servertime.getFullYear()}-${servertime.getMonth()}-${servertime.getDate()}`;

   const check = await Streak.findOne({
      habitId: id,
      dateStamp: dateStamp,
   });
   if (check) {
      throw new ApiError(401, "Streak is Already Marked Completed");
   }

   let Oldservertime = new Date(
      serverTime - serTimeOff + userTimeOff - 86400000
   );
   let OlddateStamp = `${Oldservertime.getFullYear()}-${Oldservertime.getMonth()}-${Oldservertime.getDate()}`;
   let currentS = 1;
   const prevStreak = await Streak.findOne({
      habitId: id,
      dateStamp: OlddateStamp,
   });
   if (prevStreak) {
      currentS = prevStreak.currentStreak + 1;
   }
   let streakAdd = await Streak.create({
      userId: req.user._id,
      habitId: id,
      dateStamp: dateStamp,
      currentStreak: currentS,
   });
   if (!streakAdd) {
      throw new ApiError(401, "Streak Add Failed, try again later");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, streakAdd, "habit marked Completed"));
});

const removeStreak = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to add Streak");
   }

   const checkHabit = req.user.habitsList.find((i) => i.toString() == id);
   if (!checkHabit) {
      throw new ApiError(401, "Habit with Id not found");
   }
   const serverTime = new Date();
   const serTimeOff = serverTime.getTimezoneOffset() * 60 * 1000;
   const userTimeOff = req.user.timeZone * 60 * 1000;

   let servertime = new Date(serverTime - serTimeOff + userTimeOff);
   let dateStamp = `${servertime.getFullYear()}-${servertime.getMonth()}-${servertime.getDate()}`;

   const remove = await Streak.findOneAndDelete({
      habitId: id,
      dateStamp: dateStamp,
   });
   if (!remove) {
      throw new ApiError(401, "Streak Remove Failed, try again later");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "habit marked Pending"));
});

const getSteakList = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to get Streak list");
   }
   const checkHabit = req.user.habitsList.find((i) => i.toString() == id);
   if (!checkHabit) {
      throw new ApiError(401, "Habit with Id not found");
   }

   const list = await Streak.find({ habitId: id }).limit(31)
   if (!list) {
      throw new ApiError(401, "Streak list not found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, list, "streak list fetched successfully"));
});

export {
   listHabit,
   addHabit,
   DeleteHabit,
   editHabit,
   addStreak,
   removeStreak,
   getSteakList,
};
