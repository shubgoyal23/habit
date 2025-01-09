import mongoose from "mongoose";

const RepeatSchema = new mongoose.Schema({
   name: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "daily",
   },
   value: String,
});

const streakSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,  // user id who has created the habit
         ref: "users",
         index: true,
      },
      name: String,
      description: String,
      duration: String,
      startTime: String,
      endTime: String,
      startDate: String,
      endDate: String,
      repeat: RepeatSchema, // how many times to repeat
      place: String,
      how: String,
      ifthen: String,
      point: Number,
      startDate: Date,
      steak: Number, // regular days user has completed the habit
      habitType: {
         type: String, // regular habit is daily , negative is negative which will be marked completed by default and user has to mark it as undone if he wants , oneTime is oneTime like todo
         enum: ["regular", "negative", "oneTime"],
         default: "regular",
      },
      daysCompleted: [Date],
   },
   { timestamps: true }
);

export const Streak = mongoose.model("Streak", streakSchema);
