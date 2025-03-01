import { setToken } from "@/lib/storeToken";
import { createSlice } from "@reduxjs/toolkit";

const habitSlice = createSlice({
   name: "habit",
   initialState: [],
   reducers: {
      addListHabits(state, action) {
         setToken("habitList", JSON.stringify(action.payload));
         return action.payload;
      },
      addHabit(state, action) {
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
         setToken("habitList", JSON.stringify(state));
      },
      deleteHabit(state, action) {
         let s = state.filter((item) => item._id !== action.payload);
         setToken("habitList", JSON.stringify(s));
         return s;
      },
      editHabit(state, action) {
         const habit = state.map((item) => {
            if (item._id === action.payload._id) {
               return action.payload;
            }
            return item;
         });
         setToken("habitList", JSON.stringify(habit));
         return habit;
      },
   },
});

export const { editHabit, addHabit, deleteHabit, addListHabits } =
   habitSlice.actions;
export default habitSlice.reducer;
