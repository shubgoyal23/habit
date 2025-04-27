import { conf } from "@/conf/conf";
import { clearTokens } from "@/lib/storeToken";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
   name: "Auth",
   initialState: { loggedin: false, userDate: null },
   reducers: {
      login(state, action) {
         if (!action.payload) return;
         state.loggedin = true;
         state.userDate = action.payload;
         conf.SECRET_KEY = action.payload._id;
      },
      logout(state, action) {
         state.loggedin = false;
         state.userDate = null;
         conf.SECRET_KEY = "";
         clearTokens();
      },
   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
