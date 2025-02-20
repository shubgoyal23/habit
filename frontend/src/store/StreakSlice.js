import { setToken } from "@/lib/storeToken";
import { createSlice } from "@reduxjs/toolkit";

const streakSlice = createSlice({
   name: "streak",
   initialState: {},
   reducers: {
      addSteak(state, action) {
         let data = action.payload;
         if (!state[`${data.month}-${data.year}`]) {
            state[`${data.month}-${data.year}`] = {};
         }
         state[`${data.month}-${data.year}`][data.habitId] = data;
         setToken("streakList", JSON.stringify(state));
      },
   },
});

export const { addSteak } = streakSlice.actions;
export default streakSlice.reducer;
