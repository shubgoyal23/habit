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
} from "../helpers/task.helpers.js";

// create a new habit and add it to the list
const addHabit = asyncHandler(async (req, res) => {
   const data = await Createhabit(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "habit added successfully"));
});

// edit a habit
const editHabit = asyncHandler(async (req, res) => {
   const data = await EditHabit(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "habit Edited successfully"));
});

const deleteHabit = asyncHandler(async (req, res) => {
   const data = await DeleteHabit(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "habit deleted successfully"));
});

const addStreak = asyncHandler(async (req, res) => {
   const data = await AddStreak(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "streak added successfully"));
});

const removeStreak = asyncHandler(async (req, res) => {
   const data = await RemoveStreak(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "streak removed successfully"));
});

const listHabit = asyncHandler(async (req, res) => {
   const data = await ListHabit(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "habit list fetched successfully"));
});

const listStreak = asyncHandler(async (req, res) => {
   const data = await ListStreak(req);
   return res
      .status(200)
      .json(
         new ApiResponse(200, data.data, "streak list fetched successfully")
      );
});
const getSteakListAll = asyncHandler(async (req, res) => {
   const data = await GetSteakListAll(req);
   return res
      .status(200)
      .json(
         new ApiResponse(200, data.data, "habits list fetched successfully")
      );
});

const getTodaysHabits = asyncHandler(async (req, res) => {
   const data = await GetTodaysHabits(req);
   return res
      .status(200)
      .json(new ApiResponse(200, data.data, "habit list fetched successfully"));
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
};
