import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout as authlogout } from "../../store/AuthSlice";
import { addListHabits } from "../../store/HabitSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { conf } from "@/conf/conf";
import { clearToken } from "@/lib/apphelper";

function Logout() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   useEffect(() => {
      const logout = axios.get(`${conf.BACKEND_URL}/api/v1/users/logout`, {
         withCredentials: true,
      });

      toast.promise(logout, {
         loading: "Loading",
         success: "Logout successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      logout
         .catch((err) => console.log(err))
         .finally(() => {
            dispatch(authlogout());
            dispatch(addListHabits([]));
            clearToken();
            navigate("/");
         });
   }, []);
   return <div>LoggingOut...</div>;
}

export default Logout;
