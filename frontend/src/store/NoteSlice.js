import { createSlice } from "@reduxjs/toolkit";
import { setToken } from "@/lib/storeToken";

const noteSlice = createSlice({
   name: "Note",
   initialState: {},
   reducers: {
      AddNote(state, action) {
         if (!action.payload) return;
         if (!state[action.payload.id]) state[action.payload.id] = {};
         const date = action.payload.date;
         state[action.payload.id][date] = action.payload.notesData;
         setToken("notes", JSON.stringify(state));
      },
      DeleteNote(state, action) {
         if (!action.payload) return;
         delete state[action.payload.id][action.payload.date];
         setToken("notes", JSON.stringify(state));
      },
      LoadNotes(state, action) {
         if (!action.payload) return;
         state[action.payload.id] = action.payload;
      }
   },
});

export const { AddNote, DeleteNote, LoadNotes } = noteSlice.actions;
export default noteSlice.reducer;
