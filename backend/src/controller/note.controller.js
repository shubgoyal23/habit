import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { Note } from "../models/Notes.model.js";
import { ApiError } from "../utils/ApiError.js";

const AddNote = asyncHandler(async (req, res) => {
   const { habitId, fulldate, note } = req.body;

   if (!habitId || !fulldate || !note) {
      throw new ApiError(401, "all fields are required");
   }

   if (note.length > 150) {
      throw new ApiError(401, "note is too long");
   }

   let datesplit = fulldate.split("-");
   let date = Number(datesplit[0]);
   let month = Number(datesplit[1]);
   let year = Number(datesplit[2]);

   if (!date || !month || !year) {
      throw new ApiError(401, "date is required");
   }

   let noteData = await Note.findOneAndUpdate(
      { habitId, userId: req?.user?._id, date, month, year },
      {
         $set: {
            note,
         },
      },
      { new: true, upsert: true }
   );
   if (!noteData) {
      throw new ApiError(401, "Something went wrong");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, noteData, "Note added successfully"));
});
const deleteNote = asyncHandler(async (req, res) => {
   const { noteId } = req.body;

   if (!noteId) {
      throw new ApiError(401, "noteId is required");
   }
   let noteData = await Note.findOneAndDelete({
      _id: noteId,
      userId: req?.user?._id,
   });
   if (!noteData) {
      throw new ApiError(401, "Something went wrong");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, noteData, "Note Deleted successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
   const { fulldate } = req.body;

   if (!fulldate) {
      throw new ApiError(401, "date is required");
   }
   let datesplit = fulldate.split("-");
   let date = Number(datesplit[0]);
   let month = Number(datesplit[1]);
   let year = Number(datesplit[2]);

   if (!date || !month || !year) {
      throw new ApiError(401, "date is required");
   }
   let noteData = await Note.find({
      userId: req?.user?._id,
      date,
      month,
      year,
   });
   return res
      .status(200)
      .json(new ApiResponse(200, noteData, "Note fetched successfully"));
});
const getNotesforMonth = asyncHandler(async (req, res) => {
   const { fulldate } = req.body;

   if (!fulldate) {
      throw new ApiError(401, "date is required");
   }
   let datesplit = fulldate.split("-");
   let month = Number(datesplit[0]);
   let year = Number(datesplit[1]);

   if (!month || !year) {
      throw new ApiError(401, "date is required");
   }
   let noteData = await Note.find({
      userId: req?.user?._id,
      month,
      year,
   });
   return res
      .status(200)
      .json(new ApiResponse(200, noteData, "Note fetched successfully"));
});

export { AddNote, deleteNote, getNotes, getNotesforMonth };
