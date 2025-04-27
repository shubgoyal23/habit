import { clearToken } from "@/lib/apphelper";
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
      clearSteak() {
         clearToken("streakList");
         return {};
      },
   },
});

export const { addSteak, clearSteak } = streakSlice.actions;
export default streakSlice.reducer;
