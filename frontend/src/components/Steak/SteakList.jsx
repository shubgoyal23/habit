import React, { useEffect, useState } from "react";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addListHabits } from "@/store/HabitSlice";
import MarkSteak from "../Habit/MarkSteak";
function Steak() {
   const dispatch = useDispatch();
   const habitList = useSelector((state) => state.habit) || [];

   useEffect(() => {
      axios
         .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/habit`, {
            withCredentials: true,
         })
         .then((data) => {
            dispatch(addListHabits(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);

   const checkDate = (data, index) => {
      const datetoday = new Date();
      const startDate = new Date(data.startDate);
   };

   return (
      <div className="w-full p-2 md:p-6 mt-3">
         <h1 className="text-center text-xl font-semibold my-3 text-blue-500 underline underline-offset-2">
            Habits Streak
         </h1>
         <Table className="md:p-6">
            <TableCaption>
               {habitList.length === 0
                  ? "Add habit to see here"
                  : "A list of your Daily Habits."}
            </TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead>Day/ Habit</TableHead>
                  {habitList.map((item) => (
                     <TableHead key={item._id}>{item.name}</TableHead>
                  ))}
               </TableRow>
            </TableHeader>
            <TableBody>
               {Array(30)
                  .fill(0)
                  .map((item, i) => (
                     <TableRow key={`day-${i + 1}`}>
                        <TableCell>{`day ${i + 1}`}</TableCell>
                        {habitList.map((item) => (
                           <TableCell key={item._id}>
                              {item.daysCompleted.length > i ? (
                                 <div className="bg-green-400 size-6 rounded-md flex justify-center items-center">
                                    <img src="./check.svg" className="size-5"></img>
                                 </div>
                              ) : (
                                ""
                              )}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
            </TableBody>
         </Table>

         <div className="flex justify-center mt-6">
            <Link to={"/habit/new"} className="text-blue-500 underline">
               Add New Habit
            </Link>
         </div>
      </div>
   );
}

export default Steak;
