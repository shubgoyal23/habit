import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Streak } from "../models/streak.model.js";
import { Redisclient as RedisConn } from "../db/redis.js";

const GetTimeFormated = (data) => {
   let startTime = Number(data?.replace(":", ""));
   if (!startTime) {
      return;
   }
   let hours = Math.floor(startTime / 100);
   let minutes = startTime % 100;
   minutes = Math.floor(minutes / 5) * 5;
   return { startTime, hours, minutes };
};

const listHabit = asyncHandler(async (req, res) => {
   const list = await Streak.find({ userId: req.user._id });

   return res
      .status(200)
      .json(new ApiResponse(200, list, "habit list fetched successfully"));
});

const addHabit = asyncHandler(async (req, res) => {
   const { name } = req.body;
   if (!name) {
      throw new ApiError(401, "Name Feild is Reqired");
   }

   let { startTime, hours, minutes } = GetTimeFormated(req.body?.startTime);
   // let endTime = req.body?.endTime?.replace(":", "")
   if (!startTime) {
      throw new ApiError(401, "Start Time Feild is Reqired");
   }
   const add = await Streak.create({
      userId: req.user._id,
      name: name,
      startDate: new Date(),
      description: req.body?.description,
      duration: req.body?.duration,
      startTime: req.body?.startTime,
      endTime: req.body?.endTime,
      place: req.body?.place,
      how: req.body?.how,
      ifthen: req.body?.ifthen,
      point: req.body?.point,
      daysCompleted: [],
   });
   if (!add) {
      throw new ApiError(401, "Habit Creation Failed, try again later");
   }
   await RedisConn.sAdd(
      "habitList",
      `${add._id.toString()}:${req.user._id.toString()}`
   );
   await RedisConn.sAdd(
      `habitTime:${hours}:${minutes}`,
      `${add._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, add, "Habit Added Successfully"));
});

const editHabit = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(401, "id is Reqired");
   }
   const habit = await Streak.findById(id);

   if (!habit || habit.userId == req.user._id) {
      throw new ApiError(403, "Habit not found");
   }
   let { startTime, hours, minutes } = GetTimeFormated(req.body?.startTime);

   delete req.body.id;
   const updatedHabit = await Streak.findByIdAndUpdate(
      id,
      {
         name: req.body?.name,
         description: req.body?.description,
         duration: req.body?.duration,
         startTime: req.body?.startTime,
         endTime: req.body?.endTime,
         place: req.body?.place,
         how: req.body?.how,
         ifthen: req.body?.ifthen,
         point: req.body?.point,
      },
      { new: true }
   );
   if (!updatedHabit) {
      throw new ApiError(401, "Habit Update Failed, try again later");
   }
   if (startTime) {
      let {
         startTime,
         hours: oldHours,
         minutes: oldMinutes,
      } = GetTimeFormated(habit?.startTime);
      await RedisConn.SREM(
         `habitTime:${oldHours}:${oldMinutes}`,
         `${habit._id.toString()}:${req.user._id.toString()}`
      );
      await RedisConn.sAdd(
         `habitTime:${hours}:${minutes}`,
         `${habit._id.toString()}:${req.user._id.toString()}`
      );
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
   const del = await Streak.findByIdAndDelete(id);

   if (!del) {
      throw new ApiError(401, "Habit Deletion Failed, try again later");
   }
   let { startTime, hours, minutes } = GetTimeFormated(del?.startTime);

   await RedisConn.SREM(
      `habitTime:${hours}:${minutes}`,
      `${del._id.toString()}:${req.user._id.toString()}`
   );
   await RedisConn.SREM(
      "habitList",
      `${del._id.toString()}:${req.user._id.toString()}`
   );

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Habit deleted Successfully"));
});

const addSteak = asyncHandler(async (req, res) => {
   const { id, date: habitDate } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to add Steak");
   }

   const habit = await Streak.findById(id);
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

   const habit = await Streak.findById(id);
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
