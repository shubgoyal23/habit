import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import HabitSlice from "./HabitSlice";

export const store = configureStore({
   reducer: {
      auth: AuthSlice,
      habit: HabitSlice
   },
});
