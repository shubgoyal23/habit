import { ConnectRedis } from "../db/redis.js";
import { Habit } from "../models/habit.model.js";
import { Streak } from "../models/Streak.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Redisclient as RedisConn } from "../db/redis.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { User } from "../models/user.model.js";
import {
   getUserTime,
   GetTimeFormated,
   GetTimeEpoch,
   GetTimeZoneEpoch,
   GetUTCDateEpoch,
} from "./time.helper.js";

// create a new habit and add it to the list
const Createhabit = async (data) => {
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
   } = data;

   if (data?.user?.habitsAllowed < data?.user?.habitCount) {
      throw new ApiError(
         401,
         "Habit limit reached, Delete some habits to add more"
      );
   }

   if (!name) {
      return new ApiError(401, "Name Feild is Reqired");
   }
   if (!habitType) {
      habitType = "regular";
   }

   // filter start time and end time
   switch (habitType) {
      case "negative":
         startTime = 0;
         endTime = 0;
         duration = 0;
         break;
      default:
         if (!startTime) {
            return new ApiError(401, "Start Time Feild is Reqired");
         }
         const [hr, min] = GetTimeFormated(startTime);
         startTime = GetTimeEpoch(hr, min, data?.user?.timeZone);

         if (endTime) {
            const [hr, min] = GetTimeFormated(endTime);
            endTime = GetTimeEpoch(hr, min, data?.user?.timeZone);
            if (endTime < startTime) {
               endTime += 86400;
            }
         } else {
            endTime = startTime + 60 * (duration || 1);
         }
         if (startTime && endTime) {
            duration = Math.floor((endTime - startTime) / 60);
         }
   }

   // filter start date and end date
   if (!startDate) {
      return new ApiError(401, "Start Date Feild is Reqired");
   }
   switch (habitType) {
      case "todo":
         startDate = GetUTCDateEpoch(startDate, data?.user?.timeZone);
         endDate = startDate + duration * 60;
         break;
      default:
         habitType = "regular";
         startDate = GetUTCDateEpoch(startDate, data?.user?.timeZone);
         if (endDate) {
            endDate = GetUTCDateEpoch(endDate, data?.user?.timeZone);
            if (endDate < startDate) {
               endDate += 86400;
            }
         } else {
            endDate = GetUTCDateEpoch(
               endDate || new Date().setFullYear(new Date().getFullYear() + 1),
               data?.user?.timeZone
            );
         }
   }

   if (habitType == "todo") {
      repeat = {
         name: "todo",
         value: [],
      };
   }
   if (!repeat?.name) {
      repeat = {
         name: "days",
         value: [0, 1, 2, 3, 4, 5, 6],
      };
   }
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = GetUTCDateEpoch(
               repeat.value[i],
               data?.user?.timeZone
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
      userId: data.user._id,
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
      return new ApiError(401, "Habit Creation Failed, try again later");
   }
   if (habitType != "negative") {
      await ConnectRedis();
      await RedisConn.sAdd("AllHabitLists", createUserHabit._id.toString());
   }
   await User.findByIdAndUpdate(data.user._id, {
      $inc: { habitCount: 1 },
   });

   return new ApiResponse(200, createUserHabit, "Habit Added Successfully");
};

// edit a habit
const EditHabit = async (data) => {
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
   } = data;
   if (!id) {
      throw new ApiError(401, "Habit Id is Reqired");
   }
   const habit = await Habit.findById(id);
   if (!habit.isActive) {
      if (data?.user?.habitsAllowed < data?.user?.habitCount) {
         throw new ApiError(
            401,
            "Habit limit reached, Archive or Delete some habits to add more"
         );
      }
      await User.findByIdAndUpdate(data.user._id, {
         $inc: { habitCount: 1 },
      });
   }

   if (!habit || habit.userId == data.user._id) {
      throw new ApiError(403, "Habit with Id not found for this user");
   }
   if (!name) {
      return new ApiError(401, "Name Feild is Reqired");
   }
   if (!habitType) {
      habitType = "regular";
   }

   // filter start time and end time
   switch (habitType) {
      case "negative":
         startTime = 0;
         endTime = 0;
         duration = 0;
         break;
      default:
         if (!startTime) {
            return new ApiError(401, "Start Time Feild is Reqired");
         }
         const [hr, min] = GetTimeFormated(startTime);
         startTime = GetTimeEpoch(hr, min, data?.user?.timeZone);

         if (endTime) {
            const [hr, min] = GetTimeFormated(endTime);
            endTime = GetTimeEpoch(hr, min, data?.user?.timeZone);
            if (endTime < startTime) {
               endTime += 86400;
            }
         } else {
            endTime = startTime + 60 * (duration || 1);
         }
         if (startTime && endTime) {
            duration = Math.floor((endTime - startTime) / 60);
         }
   }

   // filter start date and end date
   if (!startDate) {
      return new ApiError(401, "Start Date Feild is Reqired");
   }
   switch (habitType) {
      case "todo":
         startDate = GetUTCDateEpoch(startDate, data?.user?.timeZone);
         endDate = startDate + duration * 60;
         break;
      default:
         startDate = GetUTCDateEpoch(startDate, data?.user?.timeZone);
         if (endDate) {
            endDate = GetUTCDateEpoch(endDate, data?.user?.timeZone);
            if (endDate < startDate) {
               endDate += 86400;
            }
         } else {
            endDate = GetUTCDateEpoch(
               endDate || new Date().setFullYear(new Date().getFullYear() + 1),
               data?.user?.timeZone
            );
         }
   }

   if (habitType == "todo") {
      repeat = {
         name: "todo",
         value: [],
      };
   }
   if (!repeat?.name) {
      repeat = {
         name: "days",
         value: [0, 1, 2, 3, 4, 5, 6],
      };
   }
   switch (repeat.name) {
      case "days":
         break;
      case "dates":
         for (let i = 0; i < repeat.value.length; i++) {
            repeat.value[i] = GetUTCDateEpoch(
               repeat.value[i],
               data?.user?.timeZone
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
   const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      {
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
         notify: notify,
         isActive: true,
      },
      { new: true }
   );

   if (!updatedHabit) {
      throw new ApiError(401, "Habit Update Failed, try again later");
   }

   return new ApiResponse(200, updatedHabit, "Habit updated Successfully");
};

const DeleteHabit = async (data) => {
   const { id } = data;
   if (!id) {
      throw new ApiError(401, "id is Reqired");
   }

   const del = await Habit.findOneAndDelete({ _id: id, userId: data.user._id });
   if (!del) {
      throw new ApiError(401, "Habit Deletion Failed, try again later");
   }
   // removeStreaksdata
   await Streak.deleteMany({
      habitId: id,
   });

   if (del.isActive) {
      await User.findByIdAndUpdate(data.user._id, {
         $inc: { habitCount: -1 },
      });
   }

   // remove habit from redis
   await ConnectRedis();
   await RedisConn.SREM("AllHabitLists", id);

   return new ApiResponse(200, {}, "Habit deleted Successfully");
};

const AddStreak = async (data) => {
   const { id } = data;
   if (!id) {
      throw new ApiError(
         401,
         "Habit Id and date is required to mark completed"
      );
   }

   let servertime = getUserTime(data?.user?.timeZone);

   const check = await Streak.findOneAndUpdate(
      {
         habitId: id,
         userId: data.user._id,
         month: servertime.getMonth(),
         year: servertime.getFullYear(),
      },
      {
         $addToSet: { daysCompleted: servertime.getDate() },
      },
      {
         upsert: true,
         new: true,
      }
   );
   if (!check) {
      throw new ApiError(401, "Streak is Already Marked Completed");
   }
   let dateCompleted = GetUTCDateEpoch(servertime);
   await ConnectRedis();
   await RedisConn.SADD(`habitCompleted:${dateCompleted}`, id);

   await User.findOneAndUpdate(
      { _id: data.user._id, lastStreak: { $lt: dateCompleted } },
      {
         $inc: { streakCount: 1 },
         $set: { lastStreak: dateCompleted },
      }
   );

   return new ApiResponse(200, check, "habit marked Completed");
};

const RemoveStreak = async (data) => {
   const { id } = data;
   if (!id) {
      throw new ApiError(401, "Habit Id is required to add Streak");
   }

   let servertime = getUserTime(data?.user?.timeZone);
   const remove = await Streak.findOneAndUpdate(
      {
         habitId: id,
         userId: data.user._id,
         month: servertime.getMonth(),
         year: servertime.getFullYear(),
      },
      {
         $pull: { daysCompleted: servertime.getDate() },
      },
      {
         new: true,
      }
   );
   if (!remove) {
      throw new ApiError(401, "Streak Remove Failed, try again later");
   }

   let dateCompleted = GetUTCDateEpoch(servertime);
   await ConnectRedis();
   await RedisConn.SREM(`habitCompleted:${dateCompleted}`, id);

   return new ApiResponse(200, remove, "habit marked Pending");
};

const ListHabit = async (data) => {
   const dateTodayEpoch = GetUTCDateEpoch(new Date(), data?.user?.timeZone);
   const list = await Habit.find({
      userId: data.user._id,
      isActive: true,
      startDate: { $lte: dateTodayEpoch },
      endDate: { $gte: dateTodayEpoch },
   });
   return new ApiResponse(200, list, "habit list fetched successfully");
};

const ListStreak = async (data) => {
   let { month, year } = data;
   if (!month) {
      month = new Date().getMonth();
   }
   if (!year) {
      year = new Date().getFullYear();
   }
   const list = await Streak.find({
      userId: data.user._id,
      active: true,
      month: month,
      year: year,
   });
   if (!list) {
      throw new ApiError(401, "Streak list not found");
   }
   return new ApiResponse(200, list, "streak list fetched successfully");
};

const GetSteakListAll = async (data) => {
   const { ids } = data;
   if (!id) {
      throw new ApiError(401, "Habit Ids is required to get Streak list");
   }
   for (let i = 0; i < ids.length; i++) {
      const checkHabit = data.user.habitsList.find(
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
   return new ApiResponse(200, list, "streak list fetched successfully");
};

const GetTodaysHabits = async (data) => {
   let dateToday = getUserTime(data?.user?.timeZone);
   let dateTodayEpoch = GetUTCDateEpoch(dateToday);
   const list = await Habit.find({
      userId: data.user._id,
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
   return new ApiResponse(200, finalList, "Habit list fetched successfully");
};

const SearchHabitByName = async (data) => {
   let { name } = data;
   if (!name) {
      throw new ApiError(401, "Habit name is required");
   }
   const list = await Habit.findOne({
      userId: data.user._id,
      name: { $regex: name, $options: "i" },
   });
   if (!list) {
      throw new ApiError(401, "Habit not found");
   }
   return new ApiResponse(200, list, "Habit fetched successfully");
};

const ListHabitArchive = async (data) => {
   const dateTodayEpoch = GetUTCDateEpoch(getUserTime(data?.user?.timeZone));
   const list = await Habit.find({
      userId: data.user._id,
      endDate: { $lte: dateTodayEpoch },
   });
   return new ApiResponse(200, list, "habit archive fetched successfully");
};

export {
   GetTimeFormated,
   GetTimeEpoch,
   GetTimeZoneEpoch,
   GetUTCDateEpoch,
   Createhabit,
   EditHabit,
   DeleteHabit,
   AddStreak,
   RemoveStreak,
   ListHabit,
   ListStreak,
   GetSteakListAll,
   GetTodaysHabits,
   SearchHabitByName,
   ListHabitArchive,
};
