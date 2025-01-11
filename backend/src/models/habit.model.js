import mongoose from "mongoose";

const RepeatSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         enum: ["daily", "weekly", "monthly", "yearly"],
         default: "daily",
      },
      value: [Number], // -1 for daily once, or time like 1300 if repeat is many times on a day, 0 - 6 for weekly starting from sunday, 1-31 for monthly, 1-365 for yearly
   },
   { _id: false }
);

const HabitSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId, // user id who has created the habit
         ref: "users",
         index: true,
      },
      name: String,
      description: String,
      duration: String,
      startTime: Number, // epoch from time of date 1 jan 2025
      endTime: Number, // epoch from time of date 1 jan 2025
      startDate: Number, // epoch of start date , start of day 00:00
      endDate: Number, // epoch of end date, end of the day 23:59
      repeat: RepeatSchema, // how many times to repeat
      place: String,
      how: String,
      ifthen: String,
      point: Number,
      steak: Number, // regular days user has completed the habit
      notify: Boolean, // if yes then notificaion will we sent
      isActive: Boolean,
      habitType: {
         type: String, // regular habit is daily , negative is negative which will be marked completed by default and user has to mark it as undone if he wants , oneTime is oneTime like todo
         enum: ["regular", "negative", "oneTime"],
         default: "regular",
      },
   },
   { timestamps: true }
);

export const Habit = mongoose.model("Habit", HabitSchema);
