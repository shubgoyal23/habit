import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
   name: "Auth",
   initialState: { loggedin: false, userDate: null },
   reducers: {
      login(state, action) {
         state.loggedin = true;
         state.userDate = action.payload;
         localStorage.setItem("accessToken", action.payload.accessToken);
         localStorage.setItem("refreshToken", action.payload.refreshToken);
         axios.defaults.headers.common["AccessToken"] = localStorage.getItem("accessToken");
         axios.defaults.headers.common["RefreshToken"] = localStorage.getItem("refreshToken");
      },
      logout(state, action) {
         state.loggedin = false;
         state.userDate = null;
         localStorage.removeItem("accessToken");
         localStorage.removeItem("refreshToken");
      },
   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
