import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { conf } from "@/conf/conf";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const categoryColors = {
   health:       { bg: "bg-green-500/10",   border: "border-green-500/40",   badge: "bg-green-500/20 text-green-400" },
   fitness:      { bg: "bg-orange-500/10",  border: "border-orange-500/40",  badge: "bg-orange-500/20 text-orange-400" },
   mindfulness:  { bg: "bg-purple-500/10",  border: "border-purple-500/40",  badge: "bg-purple-500/20 text-purple-400" },
   productivity: { bg: "bg-blue-500/10",    border: "border-blue-500/40",    badge: "bg-blue-500/20 text-blue-400" },
   social:       { bg: "bg-pink-500/10",    border: "border-pink-500/40",    badge: "bg-pink-500/20 text-pink-400" },
   learning:     { bg: "bg-yellow-500/10",  border: "border-yellow-500/40",  badge: "bg-yellow-500/20 text-yellow-500" },
   finance:      { bg: "bg-emerald-500/10", border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-400" },
   sleep:        { bg: "bg-indigo-500/10",  border: "border-indigo-500/40",  badge: "bg-indigo-500/20 text-indigo-400" },
   nutrition:    { bg: "bg-lime-500/10",    border: "border-lime-500/40",    badge: "bg-lime-500/20 text-lime-500" },
   other:        { bg: "bg-gray-500/10",    border: "border-gray-500/40",    badge: "bg-gray-500/20 text-gray-400" },
};

function SuggestedHabits() {
   const [habits, setHabits] = useState([]);
   const navigate = useNavigate();
   const scrollRef = useRef(null);

   useEffect(() => {
      axios
         .get(`${conf.BACKEND_URL}/api/v1/suggested`, { withCredentials: true })
         .then((res) => {
            if (res.data?.data) setHabits(res.data.data);
         })
         .catch(() => {});
   }, []);

   if (!habits.length) return null;

   const scroll = (dir) => {
      scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
   };

   return (
      <div className="mt-8">
         <h2 className="text-sm text-center text-chart-4 mb-3">
            Suggested For You
         </h2>

         <div className="relative group">
            {/* left arrow — desktop only */}
            <button
               onClick={() => scroll(-1)}
               className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-background border border-border shadow hover:bg-muted transition-colors"
            >
               <ChevronLeft className="w-4 h-4" />
            </button>

            <div
               ref={scrollRef}
               className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            >
               {habits.map((habit) => {
                  const color = categoryColors[habit.category] ?? categoryColors.other;
                  return (
                     <div
                        key={habit._id}
                        className={`snap-start shrink-0 w-44 rounded-xl p-3 border ${color.bg} ${color.border} flex flex-col justify-between gap-2`}
                     >
                        {/* top: category badge + duration */}
                        <div className="flex items-center justify-between">
                           <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${color.badge}`}>
                              {habit.category}
                           </span>
                           {habit.duration && (
                              <span className="text-[10px] text-muted-foreground">
                                 {habit.duration} min
                              </span>
                           )}
                        </div>

                        {/* name */}
                        <p className="text-sm font-semibold capitalize leading-snug line-clamp-2">
                           {habit.name}
                        </p>

                        {/* description */}
                        {habit.description && (
                           <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {habit.description}
                           </p>
                        )}

                        {/* add button */}
                        <button
                           onClick={() =>
                              navigate("/habit/new", {
                                 state: {
                                    prefill: {
                                       name: habit.name,
                                       description: habit.description,
                                       duration: habit.duration,
                                       repeat: habit.repeat,
                                       habitType: habit.habitType,
                                    },
                                 },
                              })
                           }
                           className={`mt-1 w-full flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg ${color.badge} hover:opacity-80 transition-opacity`}
                        >
                           <Plus className="w-3.5 h-3.5" />
                           Add Habit
                        </button>
                     </div>
                  );
               })}
            </div>

            {/* right arrow — desktop only */}
            <button
               onClick={() => scroll(1)}
               className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-background border border-border shadow hover:bg-muted transition-colors"
            >
               <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
   );
}

export default SuggestedHabits;
