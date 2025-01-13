import { createSlice } from "@reduxjs/toolkit";

const streakSlice = createSlice({
   name: "streak",
   initialState: {},
   reducers: {
      addSteakList(state, action) {
         state[action.payload[0].habitId] = action.payload;
      },
      addSteak(state, action) {
         state[action.payload.habitId].push(action.payload);
      },
      removeStreak(state, action) {
         state[action.payload.habitId] = state[action.payload.habitId].filter(
            (item) => item._id !== action.payload._id
         );
      },
   },
});

export const { addSteakList, addSteak, removeStreak } = streakSlice.actions;
export default streakSlice.reducer;
