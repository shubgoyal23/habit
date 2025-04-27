import { createSlice } from "@reduxjs/toolkit";
import { setToken } from "@/lib/storeToken";

const noteSlice = createSlice({
   name: "Note",
   initialState: {},
   reducers: {
      AddNote(state, action) {
         if (!action.payload) return;
         const date = action.payload.date;
         const month = action.payload.month;
         if (!state[month]) state[month] = {};
         if (!state[month][action.payload.id])
            state[month][action.payload.id] = {};
         state[month][action.payload.id][date] = action.payload.notesData;
         setToken("notes", JSON.stringify(state));
      },
      DeleteNote(state, action) {
         if (!action.payload) return;
         delete state[action.payload.month][action.payload.id][
            action.payload.date
         ];
         setToken("notes", JSON.stringify(state));
      },
      LoadNotes(state, action) {
         if (!action.payload) return;
         state = action.payload;
         return state;
      },
      ClearNotes() {
         return {};
      },
   },
});

export const { AddNote, DeleteNote, LoadNotes, ClearNotes } = noteSlice.actions;
export default noteSlice.reducer;
