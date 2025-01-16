import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxAvatar } from "react-icons/rx";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import axios from "axios";
import MarkSteak from "../Habit/MarkSteak";
function Home() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const user = useSelector((state) => state.auth.userDate);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const dateToday = new Date().toDateString().split(" ");
   const [habitList, setHabitList] = useState([]);

   const getTodayHabits = async () => {
      const hl = axios.get(`${conf.BACKEND_URL}/api/v1/steak/habits-today`, {
         withCredentials: true,
      });

      toast.promise(hl, {
         loading: "Loading",
         success: "Habit list fetched successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      hl.then((data) => {
         setHabitList(data?.data?.data);
      }).catch((err) => console.log(err));
   };

   useEffect(() => {
      if (!loggedin) {
         navigate("/login");
      } else {
         getTodayHabits();
      }
   }, []);
   return (
      <div>
         <div className="w-full flex justify-between items-center m-0 px-2 mt-4">
            <h2 className="m-0 text-lg font-bold">Hello, {user?.firstName}!</h2>
            <Link to="/profile" className="">
               <RxAvatar className="w-6 h-6" />
            </Link>
         </div>
         <div className="w-full flex justify-between items-center m-0 px-2">
            <h2 className="m-0 text-lg text-violet-500">
               {dateToday[1]} {dateToday[2]}
            </h2>
         </div>
         <div className="w-full flex-col justify-between items-center m-0 mt-6 px-2 py-4 rounded-lg shadow-top-lg">
            <h2 className="m-0 text-lg underline underline-offset-4">
               Todays Tasks
            </h2>
            <div className="">
               {habitList.map((item) => (
                  <div className="space-y-1 p-2 pl-3 flex justify-start items-center gap-5">
                     <MarkSteak row={{ original: item }} />
                     <div className="flex flex-1 items-center justify-start bg-white/10 rounded-lg py-4 px-2">
                        <span>{item.name}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Home;
