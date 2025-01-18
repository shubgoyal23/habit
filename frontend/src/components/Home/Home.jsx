import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxAvatar } from "react-icons/rx";
import MarkSteak from "../Habit/MarkSteak";
import { GetHabitDueToday } from "@/lib/helpers";

function Home() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const user = useSelector((state) => state.auth.userDate);
   const habitListAll = useSelector((state) => state.habit);
   const navigate = useNavigate();
   const dateToday = new Date();
   const [habitList, setHabitList] = useState([]);

   useEffect(() => {
      if (!habitListAll || habitListAll?.length <= 0) return;
      setHabitList(GetHabitDueToday(habitListAll));
   }, [habitListAll]);

   useEffect(() => {
      if (!loggedin) {
         navigate("/login");
      }
   }, []);
   return (
      <div>
         <div className="w-full flex justify-between items-center m-0 px-2 mt-4">
            <h2 className="m-0 text-lg font-bold">Hello, {user?.firstName}!</h2>
            <Link to="/profile" className="md:hidden">
               <RxAvatar className="w-6 h-6" />
            </Link>
         </div>
         <div className="w-full flex justify-between items-center m-0 px-2">
            <h2 className="m-0 text-lg text-violet-500">
               {dateToday[1]} {dateToday[2]}
            </h2>
         </div>
         <div className="w-full flex-col justify-between items-center m-0 mt-6 px-2 py-4 rounded-lg">
            <h2 className="m-0 text-lg underline underline-offset-4 text-center">
               Todays Tasks
            </h2>
            <div className="">
               {habitList?.map((item) => (
                  <div
                     key={item?._id}
                     className="space-y-1 p-2 pl-3 flex justify-start items-center gap-5"
                  >
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
