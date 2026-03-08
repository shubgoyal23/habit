import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkSteak from "../Habit/MarkSteak";
import { EpochToTime, GetHabitDueToday } from "@/lib/helpers";
import NotesBox from "../Notes/NotesBox";
import { CheckCircle2, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SuggestedHabits from "../Habit/SuggestedHabits";

const COLORS = [
   {
      bg: "bg-violet-500/10",
      border: "border-violet-500/25",
      badge: "bg-violet-500/20 text-violet-400",
      btn: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25",
   },
   {
      bg: "bg-sky-500/10",
      border: "border-sky-500/25",
      badge: "bg-sky-500/20 text-sky-400",
      btn: "bg-sky-500/15 text-sky-400 hover:bg-sky-500/25",
   },
   {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
      badge: "bg-emerald-500/20 text-emerald-400",
      btn: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25",
   },
   {
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      badge: "bg-amber-500/20 text-amber-500",
      btn: "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25",
   },
   {
      bg: "bg-rose-500/10",
      border: "border-rose-500/25",
      badge: "bg-rose-500/20 text-rose-400",
      btn: "bg-rose-500/15 text-rose-400 hover:bg-rose-500/25",
   },
   {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/25",
      badge: "bg-cyan-500/20 text-cyan-400",
      btn: "bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25",
   },
   {
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/25",
      badge: "bg-fuchsia-500/20 text-fuchsia-400",
      btn: "bg-fuchsia-500/15 text-fuchsia-400 hover:bg-fuchsia-500/25",
   },
   {
      bg: "bg-orange-500/10",
      border: "border-orange-500/25",
      badge: "bg-orange-500/20 text-orange-400",
      btn: "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25",
   },
];

function Home() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const user = useSelector((state) => state.auth.userDate);
   const habitListAll = useSelector((state) => state.habit);
   const streakList = useSelector((state) => state.streak) || {};
   const navigate = useNavigate();
   const dateToday = new Date();
   const [habitList, setHabitList] = useState([]);

   const todayStamp = `${dateToday.getMonth()}-${dateToday.getFullYear()}`;
   const todayDay = dateToday.getDate();

   const isCompleted = (habitId, habitType) => {
      const marked =
         streakList?.[todayStamp]?.[habitId]?.daysCompleted?.includes(
            todayDay,
         ) ?? false;
      return habitType === "negative" ? !marked : marked;
   };

   useEffect(() => {
      if (!habitListAll || habitListAll?.length <= 0) return;
      setHabitList(GetHabitDueToday(habitListAll));
   }, [habitListAll]);

   useEffect(() => {
      if (!loggedin) navigate("/login");
   }, []);

   return (
      <div className="w-full h-full flex justify-center items-center">
         <Card className="pt-10 md:pt-6 mx-auto w-full h-full pb-0">
            <CardHeader className="space-y-1 flex justify-between items-center">
               <CardTitle className="text-2xl font-bold">
                  Hello, {user?.firstName}!
               </CardTitle>
            </CardHeader>

            <CardContent className="overflow-y-scroll h-full">
               {/* ── Today's Tasks ── */}
               <div>
                  <h2 className="text-sm text-center text-chart-4 mb-3">
                     Today's Tasks
                  </h2>

                  <div className="flex flex-wrap gap-2 w-full">
                     {habitList?.map((item, i) => {
                        const color = COLORS[i % COLORS.length];
                        const done = isCompleted(item._id, item.habitType);

                        return (
                           <div
                              key={item._id}
                              className={`rounded-xl p-3 border flex flex-col gap-2 transition-all duration-300 w-[48%] max-w-50 ${color.bg} ${color.border} ${done ? "opacity-55" : ""}`}
                           >
                              {/* badge + completion toggle */}
                              <div className="flex items-start justify-between gap-1">
                                 <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize leading-none ${color.badge}`}
                                 >
                                    {item.habitType}
                                 </span>
                                 <MarkSteak row={{ original: item }} />
                              </div>

                              {/* name */}
                              <p
                                 className={`text-sm font-bold leading-snug line-clamp-1 transition-all ${done ? "line-through text-muted-foreground" : ""}`}
                              >
                                 {item.name}
                              </p>

                              {/* description */}
                              {item.description && (
                                 <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                    {item.description}
                                 </p>
                              )}

                              {/* time + duration */}
                              {(item.startTime || item.duration) && (
                                 <span className="text-[11px] text-muted-foreground font-medium">
                                    {item.startTime
                                       ? `⏰ ${EpochToTime(item.startTime * 1000)}${item.duration ? ` · ${item.duration}m` : ""}`
                                       : `⏱ ${item.duration}m`}
                                 </span>
                              )}

                              {/* action row */}
                              <div className="flex items-center gap-1.5">
                                 {/* notes — compact wrapper */}
                                 <div
                                    className={`flex-1 text-[11px] font-medium rounded-lg py-1 px-1 ${color.btn} transition-colors`}
                                 >
                                    <NotesBox
                                       habitId={item._id}
                                       date={dateToday}
                                       compact
                                    />
                                 </div>

                                 {/* timer or done */}
                                 {done ? (
                                    <div className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg bg-green-500/15 text-green-500">
                                       <CheckCircle2 className="w-3.5 h-3.5" />
                                       Done
                                    </div>
                                 ) : (
                                    item.habitType !== "negative" && (
                                       <button
                                          onClick={() =>
                                             navigate(
                                                `/timer?id=${item._id}&min=${item.duration}`,
                                             )
                                          }
                                          className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg transition-colors ${color.btn}`}
                                       >
                                          <Timer className="w-3.5 h-3.5" />
                                          Timer
                                       </button>
                                    )
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* ── Suggested Habits ── */}
               <SuggestedHabits />
            </CardContent>
         </Card>
      </div>
   );
}

export default Home;
