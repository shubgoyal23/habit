import { createSlice } from "@reduxjs/toolkit";

const habitSlice = createSlice({
   name: "habit",
   initialState: [],
   reducers: {
      addListHabits(state, action) {
         return action.payload;
      },
      addHabit(state, action) {
         state.push(action.payload);
      },
      deleteHabit(state, action) {
         return state.filter((item) => item._id !== action.payload);
      },
      editHabit(state, action) {
         const habit = state.map((item) => {
            if (item._id === action.payload._id) {
               return action.payload;
            }
            return item;
         });

         return habit;
      },
   },
});

export const { editHabit, addHabit, deleteHabit, addListHabits } =
   habitSlice.actions;
export default habitSlice.reducer;
