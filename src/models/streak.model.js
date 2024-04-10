import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
   taskName: String,
   point: Number,
}, { _id: false });

const streakSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         unique: true,
         index: true,
      },
      startDate: Date,
      dailyPoint: [{date: Date, task: [pointSchema]}],
   },
   { timestamps: true }
);

export const Streak = mongoose.model("Streak", streakSchema);
