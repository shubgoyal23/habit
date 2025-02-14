import { SetTheme as SetThemeLocal } from "@/lib/apphelper";
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
   name: "userTheme",
   initialState: localStorage.getItem("theme") || "system",
   reducers: {
      setTheme(state, action) {
         if (action.payload === "dark") {
            document.documentElement.classList.add("dark");
         } else if (action.payload === "light") {
            document.documentElement.classList.remove("dark");
         } else {
            window.matchMedia("(prefers-color-scheme: dark)").matches
               ? document.documentElement.classList.add("dark")
               : document.documentElement.classList.remove("dark");
            action.payload = "system";
         }
         SetThemeLocal(action.payload);
         return action.payload;
      },
   },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
