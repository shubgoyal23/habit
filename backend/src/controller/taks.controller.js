import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
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
} from "../helpers/task.helpers.js";
import { ApiError } from "../utils/ApiError.js";

// create a new habit and add it to the list
const addHabit = asyncHandler(async (req, res) => {
   const data = await Createhabit({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

// edit a habit
const editHabit = asyncHandler(async (req, res) => {
   const data = await EditHabit({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const deleteHabit = asyncHandler(async (req, res) => {
   const data = await DeleteHabit({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const addStreak = asyncHandler(async (req, res) => {
   const data = await AddStreak({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const removeStreak = asyncHandler(async (req, res) => {
   const data = await RemoveStreak({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const listHabit = asyncHandler(async (req, res) => {
   const data = await ListHabit({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const listStreak = asyncHandler(async (req, res) => {
   const data = await ListStreak({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});
const getSteakListAll = asyncHandler(async (req, res) => {
   const data = await GetSteakListAll({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const getTodaysHabits = asyncHandler(async (req, res) => {
   const data = await GetTodaysHabits({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const searchHabitByName = asyncHandler(async (req, res) => {
   const data = await SearchHabitByName({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

const listHabitArchive = asyncHandler(async (req, res) => {
   const data = await ListHabitArchive({ ...req.body, user: req.user });
   if (data instanceof ApiError) {
      throw data;
   }
   return res.status(200).json(data);
});

export {
   listHabit,
   addHabit,
   deleteHabit,
   editHabit,
   addStreak,
   removeStreak,
   listStreak,
   getTodaysHabits,
   getSteakListAll,
   searchHabitByName,
   listHabitArchive,
};
