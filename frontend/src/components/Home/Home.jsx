import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkSteak from "../Habit/MarkSteak";
import { GetHabitDueToday } from "@/lib/helpers";
import NotesBox from "../Notes/NotesBox";
import { CircleUser, Timer } from "lucide-react";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";

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
      <div className="w-full h-full flex justify-center items-center">
         <Card className="pt-4 md:pt-0 mx-auto w-full h-full pb-0">
            <CardHeader className="space-y-1 flex justify-between items-center">
               <CardTitle className="text-2xl font-bold">
                  Hello, {user?.firstName}!
               </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-scroll h-full">
               <div>
                  <h2 className="m-0 text-sm text-center text-chart-4 mb-2">
                     Todays Tasks
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                                 <NotesBox
                                    habitId={item?._id}
                                    date={dateToday}
                                 />
                              </div>
                              <div
                                 className="flex flex-1 w-full items-center justify-between md:justify-end gap-1 cursor-pointer hover:text-primary"
                                 onClick={() =>
                                    navigate(
                                       `/timer?id=${item?._id}&min=${item?.duration}`
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
            </CardContent>
            <CardFooter className="justify-center">
               <div className="flex justify-center">
                  <Link to={"/habit"} className="text-chart-4">
                     Add New Habit
                  </Link>
               </div>
            </CardFooter>
         </Card>
      </div>
   );
}

export default Home;
