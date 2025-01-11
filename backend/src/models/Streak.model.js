import mongoose from "mongoose";

const StreakSchema = new mongoose.Schema({
   habitId: {
      type: mongoose.Schema.Types.ObjectId, // habit id
      ref: "streaks",
      index: true,
   },
   Epoch: Number,
});

export const Steak = mongoose.model("Steak", StreakSchema);
