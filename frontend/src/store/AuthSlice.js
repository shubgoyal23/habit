import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
   name: "Auth",
   initialState: { loggedin: false, userDate: null },
   reducers: {
      login(state, action) {
         if (!action.payload) return;
         state.loggedin = true;
         state.userDate = action.payload;
      },
      logout(state, action) {
         state.loggedin = false;
         state.userDate = null;
      },
   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
