import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         index: true,
      },
      name: String,
      description: String,
      duration: String,
      startTime: String,
      endTime: String,
      place: String,
      how: String,
      ifthen: String,
      point: Number,
      startDate: Date,
      daysCompleted: [],
   },
   { timestamps: true }
);

export const Streak = mongoose.model("Streak", streakSchema);
