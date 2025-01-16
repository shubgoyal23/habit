import mongoose from "mongoose";

const StreakSchema = new mongoose.Schema({
   habitId: {
      type: mongoose.Schema.Types.ObjectId, // habit id
      ref: "streaks",
      index: true,
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId, // user id
      ref: "users",
      index: true,
   },
   daysCompleted: [Number],
   month: Number,
   year: Number,
   active: {
      type: Boolean,
      default: true,
   },
});

export const Streak =
   mongoose.models.Streak || mongoose.model("Streak", StreakSchema);
