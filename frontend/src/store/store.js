import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import HabitSlice from "./HabitSlice";
import streakSlice from "./StreakSlice";

export const store = configureStore({
   reducer: {
      auth: AuthSlice,
      habit: HabitSlice,
      streak: streakSlice,
   },
});
