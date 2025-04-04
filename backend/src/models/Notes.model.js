import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
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
   date: Number,
   month: Number,
   year: Number,
   note: {
      type: String,
      maxlength: 1000,
   },
});

export const Note =
   mongoose.models.Note || mongoose.model("Note", NoteSchema);
