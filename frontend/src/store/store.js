import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import HabitSlice from "./HabitSlice";
import streakSlice from "./StreakSlice";
import themeSlice from "./ThemeSlice";
import noteSlice from "./NoteSlice";
import archiveSlice from "./ArchiveSlice";

export const store = configureStore({
   reducer: {
      auth: AuthSlice,
      habit: HabitSlice,
      streak: streakSlice,
      userTheme: themeSlice,
      note: noteSlice,
      archive: archiveSlice,
   },
});
