import { createSlice } from "@reduxjs/toolkit";

const streakSlice = createSlice({
   name: "streak",
   initialState: {},
   reducers: {
      addSteakList(state, action) {
         let data = action.payload;
         state[`${data.month}-${data.year}`] = {};
         state[`${data.month}-${data.year}`][data.habitId] = data;
      },
      addSteak(state, action) {
         let data = action.payload;
         if (!state[`${data.month}-${data.year}`]) {
            state[`${data.month}-${data.year}`] = {};
            state[`${data.month}-${data.year}`][data.habitId] = data;
         } else {
            state[`${data.month}-${data.year}`][data.habitId] = data;
         }
      },
   },
});

export const { addSteakList, addSteak } = streakSlice.actions;
export default streakSlice.reducer;
