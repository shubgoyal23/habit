import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         index: true,
      },
      topic: String,
      desc: String,
   },
   { timestamps: true }
);

export const Feedback =
   mongoose.model.Feedback || mongoose.model("feedback", FeedbackSchema);
