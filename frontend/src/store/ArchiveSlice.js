import { setToken } from "@/lib/storeToken";
import { createSlice } from "@reduxjs/toolkit";

const archiveSlice = createSlice({
   name: "Archive",
   initialState: [],
   reducers: {
      addListArchives(state, action) {
         setToken("HabitArchive", JSON.stringify(action.payload));
         return action.payload;
      },
      addArchive(state, action) {
         const habitIdx = state.indexOf((item) => {
            if (item._id === action.payload._id) {
               return true;
            }
            return false;
         });
         if (habitIdx == -1) {
            state.push(action.payload);
         } else {
            state[habitIdx] = action.payload;
         }
         setToken("HabitArchive", JSON.stringify(state));
      },
      deleteArchive(state, action) {
         let s = state.filter((item) => item._id !== action.payload);
         setToken("HabitArchive", JSON.stringify(s));
         return s;
      },
   },
});

export const { addListArchives, addArchive, deleteArchive } =
   archiveSlice.actions;
export default archiveSlice.reducer;
