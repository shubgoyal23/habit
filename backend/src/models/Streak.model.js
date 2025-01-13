import mongoose from "mongoose";

const StreakSchema = new mongoose.Schema({
   habitId: {
      type: mongoose.Schema.Types.ObjectId, // habit id
      ref: "streaks",
      index: true,
   },
   dateStamp: String,
   currentStreak: Number,
   isfreeze: {
      type: Boolean,
      default: false,
   },
});

export const Streak = mongoose.model("Streak", StreakSchema);
