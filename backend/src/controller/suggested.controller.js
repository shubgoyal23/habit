import { SuggestedHabit } from "../models/suggestedHabit.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getSuggestedHabits = asyncHandler(async (req, res) => {
   const { age, gender, country } = req.user;

   const query = { isActive: true };

   if (age) {
      query.$and = [
         { $or: [{ ageMin: null }, { ageMin: { $exists: false } }, { ageMin: { $lte: age } }] },
         { $or: [{ ageMax: null }, { ageMax: { $exists: false } }, { ageMax: { $gte: age } }] },
      ];
   }

   if (gender) {
      query.gender = { $in: [gender, "any"] };
   }

   if (country) {
      query.$or = [{ countries: { $size: 0 } }, { countries: country }];
   }

   const habits = await SuggestedHabit.find(query).limit(10).lean();

   return res
      .status(200)
      .json(new ApiResponse(200, habits, "Suggested habits fetched successfully"));
});

export { getSuggestedHabits };
