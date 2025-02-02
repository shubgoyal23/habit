import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Habit } from "../models/habit.model.js";
import { ConnectRedis, Redisclient as RedisConn } from "../db/redis.js";
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
const GetTimeEpoch = (hr, min, userOffset = 0) => {
   const epoch = Date.UTC(2025, 0, 1, hr, min, 0, 0) / 1000; // get epoch in seconds
   const time = Number(epoch + userOffset * 60);
   return time; // convert user offset in minutes to seconds
};
// set time of hours and minutes in epoch format based on 1 jan 2025, 22:00
const GetTimeZoneEpoch = (userOffset = 0) => {
   const epoch = Date.UTC(2025, 0, 1, 22, 0, 0, 0);
   const time = Number(epoch + userOffset * 60000);
   const finaltime = new Date(time);
   finaltime.setUTCMinutes(0, 0, 0);
   return Math.ceil(finaltime / 1000);
};

// this will return date in epoch format based on 12:00 pm in utc for that date
const GetUTCDateEpoch = (date, userOffset = 0) => {
   if (!date) return;
   let userDate = new Date(date).getTime() - userOffset * 60 * 1000;
   let dateNew = new Date(userDate);
   let utcDate =
      Date.UTC(
         dateNew.getFullYear(),
         dateNew.getMonth(),
         dateNew.getDate(),
         12,
         0,
         0,
         0
      ) / 1000;
   return Math.ceil(utcDate);
};

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
      startTime = GetTimeEpoch(hr, min, req?.user?.timeZone);
   }
   if (endTime) {
      const [hr, min] = GetTimeFormated(endTime);
      endTime = GetTimeEpoch(hr, min, req?.user?.timeZone);
      if (endTime < startTime) {
         endTime += 86400;
      }
   }
   if (startTime && endTime) {
      duration = Math.floor((endTime - startTime) / 60);
   }

   startDate = GetUTCDateEpoch(startDate || new Date(), req?.user?.timeZone);
   endDate = GetUTCDateEpoch(
      endDate || new Date().setFullYear(new Date().getFullYear() + 1),
      req?.user?.timeZone
   );

   if (habitType == "todo") {
      repeat = {
         name: "todo",
         value: [],
      };
   }
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = GetUTCDateEpoch(
               repeat.value[i],
               req?.user?.timeZone
            );
         }
         break;
      case "hours":
         break;
      case "todo":
         repeat.value = [];
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
   if (habitType != "negative") {
      let userE = GetTimeZoneEpoch(req?.user?.timeZone);
      await ConnectRedis();
      await RedisConn.sAdd(
         `habitLists:${userE}`,
         `${createUserHabit._id.toString()}:${req.user._id}`
      );
   }
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
      startTime = GetTimeEpoch(hr, min, req?.user?.timeZone);
   }
   if (endTime) {
      const [hr, min] = GetTimeFormated(endTime);
      endTime = GetTimeEpoch(hr, min, req?.user?.timeZone);
      if (endTime < startTime) {
         endTime += 86400;
      }
   }
   if (startTime && endTime) {
      duration = Math.floor((endTime - startTime) / 60);
   }
   if (startDate) {
      startDate = GetUTCDateEpoch(startDate, req?.user?.timeZone);
   }
   if (endDate) {
      endDate = GetUTCDateEpoch(endDate, req?.user?.timeZone);
   }
   if (habitType == "todo") {
      repeat = {
         name: "todo",
         value: [],
      };
   }
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = GetUTCDateEpoch(
               repeat.value[i],
               req?.user?.timeZone
            );
         }
         break;
      case "hours":
         break;
      case "todo":
         repeat.value = [];
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

   // remove habit from redis
   let userE = GetTimeZoneEpoch(req?.user?.timeZone);
   await ConnectRedis();
   await RedisConn.SREM(`habitLists:${userE}`, `${id}:${req.user._id}`);

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
   const userTimeOff = req?.user?.timeZone * 60 * 1000;

   let servertime = new Date(serverTime - serTimeOff + userTimeOff);

   const check = await Streak.findOneAndUpdate(
      {
         habitId: id,
         userId: req.user._id,
         month: servertime.getMonth(),
         year: servertime.getFullYear(),
      },
      {
         $addToSet: { daysCompleted: serverTime.getDate() },
      },
      {
         upsert: true,
         new: true,
      }
   );
   if (!check) {
      throw new ApiError(401, "Streak is Already Marked Completed");
   }
   let dateCompleted = GetUTCDateEpoch(new Date(), req?.user?.timeZone);
   await ConnectRedis();
   await RedisConn.SADD(`habitCompleted:${dateCompleted}`, `${id}:${req.user._id}`);

   return res
      .status(200)
      .json(new ApiResponse(200, check, "habit marked Completed"));
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
   const userTimeOff = req?.user?.timeZone * 60 * 1000;
   let servertime = new Date(serverTime - serTimeOff + userTimeOff);

   const remove = await Streak.findOneAndUpdate(
      {
         habitId: id,
         userId: req.user._id,
         month: servertime.getMonth(),
         year: servertime.getFullYear(),
      },
      {
         $pull: { daysCompleted: serverTime.getDate() },
      },
      {
         new: true,
      }
   );
   if (!remove) {
      throw new ApiError(401, "Streak Remove Failed, try again later");
   }

   let dateCompleted = GetUTCDateEpoch(new Date(), req?.user?.timeZone);
   await ConnectRedis();
   await RedisConn.SREM(`habitCompleted:${dateCompleted}`, `${id}:${req.user._id}`);

   return res
      .status(200)
      .json(new ApiResponse(200, remove, "habit marked Pending"));
});

const listHabit = asyncHandler(async (req, res) => {
   const list = await Habit.find({ userId: req.user._id });

   return res
      .status(200)
      .json(new ApiResponse(200, list, "habit list fetched successfully"));
});

const listStreak = asyncHandler(async (req, res) => {
   let { month, year } = req.body;
   if (!month) {
      month = new Date().getMonth();
   }
   if (!year) {
      year = new Date().getFullYear();
   }
   const list = await Streak.find({
      userId: req.user._id,
      active: true,
      month: month,
      year: year,
   });
   if (!list) {
      throw new ApiError(401, "Streak list not found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, list, "streak list fetched successfully"));
});
const getSteakListAll = asyncHandler(async (req, res) => {
   const { ids } = req.body;
   if (!id) {
      throw new ApiError(401, "Habit Ids is required to get Streak list");
   }
   for (let i = 0; i < ids.length; i++) {
      const checkHabit = req.user.habitsList.find(
         (i) => i.toString() == ids[i]
      );
      if (!checkHabit) {
         throw new ApiError(401, "Habit with Id not found");
      }
   }
   const list = await Streak.find({ habitId: { $in: ids } });
   if (!list) {
      throw new ApiError(401, "Streak list not found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, list, "streak list fetched successfully"));
});

const getTodaysHabits = asyncHandler(async (req, res) => {
   let dateToday = new Date();
   let dateTodayEpoch = GetUTCDateEpoch(dateToday, req?.user?.timeZone);
   const list = await Habit.find({
      userId: req.user._id,
      startDate: { $lte: dateTodayEpoch },
      endDate: { $gte: dateTodayEpoch },
   });
   if (!list) {
      throw new ApiError(401, "Habit list not found");
   }
   let finalList = [];
   for (let i = 0; i < list.length; i++) {
      if (list[i].repeat.name == "days") {
         if (list[i].repeat.value.includes(dateToday.getUTCDay())) {
            finalList.push(list[i]);
         }
      } else if (list[i].repeat.name == "dates") {
         if (list[i].repeat.value.includes(dateTodayEpoch)) {
            finalList.push(list[i]);
         }
      } else if (list[i].repeat.name == "todo") {
         finalList.push(list[i]);
      }
   }
   return res
      .status(200)
      .json(new ApiResponse(200, finalList, "Habit list fetched successfully"));
});

export {
   listHabit,
   addHabit,
   DeleteHabit,
   editHabit,
   addStreak,
   removeStreak,
   listStreak,
   getTodaysHabits,
   getSteakListAll,
};
