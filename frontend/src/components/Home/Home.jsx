import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkSteak from "../Habit/MarkSteak";
import { GetHabitDueToday } from "@/lib/helpers";
import NotesBox from "../Notes/NotesBox";
import { CircleUser, Timer } from "lucide-react";

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
               <div className="w-6 h-6">
                  {user?.picture ? (
                     <img
                        src={user?.picture}
                        className="w-full h-full rounded-full"
                     />
                  ) : (
                     <CircleUser className="w-6 h-6" />
                  )}
               </div>
            </Link>
         </div>
         <div className="w-full flex justify-between items-center m-0 px-2">
            <h2 className="m-0 text-lg text-violet-500">
               {dateToday[1]} {dateToday[2]}
            </h2>
         </div>
         <div className="w-full flex-col justify-between items-center m-0 mt-6 px-2 py-4 rounded-lg">
            <h2 className="m-0 text-xl font-bold underline underline-offset-4 text-center text-chart-4">
               Todays Tasks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2 mt-2">
               {habitList?.map((item) => (
                  <div
                     key={item?._id}
                     className="w-full bg-primary/20 rounded-lg p-2 md:p-5 border border-primary/50"
                  >
                     <div className="w-full font-bold text-lg flex items-center justify-between">
                        <h3 className="text-chart-1">{item.name}</h3>
                        <MarkSteak row={{ original: item }} />
                     </div>
                     <div className="flex w-full gap-2 items-center justify-between mt-5 flex-col md:flex-row">
                        <div className="w-full flex-1">
                           <NotesBox habitId={item?._id} date={dateToday} />
                        </div>
                        <div
                           className="flex flex-1 w-full items-center justify-between md:justify-end gap-1 cursor-pointer hover:text-primary"
                           onClick={() =>
                              navigate(
                                 `/timer?id=${item?._id}&min=${item?.duration}`,
                              )
                           }
                        >
                           <div>Start Timer</div>
                           <div>
                              <Timer className="w-4 h-4" />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Home;
