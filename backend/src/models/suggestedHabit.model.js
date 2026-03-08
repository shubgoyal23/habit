import mongoose from "mongoose";

const RepeatSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         enum: ["days", "dates", "hours", "todo"],
      },
      value: [Number],
   },
   { _id: false }
);

const SuggestedHabitSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      description: String,
      duration: String,
      repeat: RepeatSchema,
      habitType: {
         type: String,
         enum: ["regular", "negative", "todo"],
         default: "regular",
      },
      category: {
         type: String,
         enum: [
            "health",
            "fitness",
            "mindfulness",
            "productivity",
            "social",
            "learning",
            "finance",
            "sleep",
            "nutrition",
            "other",
         ],
         default: "other",
      },
      tags: [String],
      // Targeting filters — null/undefined means no restriction
      ageMin: Number,
      ageMax: Number,
      gender: {
         type: String,
         enum: ["male", "female", "any"],
         default: "any",
      },
      countries: {
         type: [String],
         default: [], // empty = all countries
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   { timestamps: true }
);

export const SuggestedHabit =
   mongoose.models.SuggestedHabit ||
   mongoose.model("SuggestedHabit", SuggestedHabitSchema);
