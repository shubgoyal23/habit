import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { addListHabits } from "@/store/HabitSlice";
import { conf } from "@/conf/conf";
import { IoIosArrowForward } from "react-icons/io";
import { addSteak } from "@/store/StreakSlice";
import { FaRegCheckCircle } from "react-icons/fa";
import { SlClose } from "react-icons/sl";
import { PiFireFill } from "react-icons/pi";

const monthsName = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];
const datenow = new Date()
const DateToday = new Date(
   Date.UTC(
      datenow.getFullYear(),
      datenow.getMonth(),
      datenow.getDate(),
      12,
      0,
      0,
      0
   )
)

function Steak() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.auth.loggedin);
   const habitList = useSelector((state) => state.habit) || [];
   const streakList = useSelector((state) => state.streak) || [];
   const [month, setMonth] = useState(new Date().getMonth());
   const [year, setYear] = useState(new Date().getFullYear());

   useEffect(() => {
      if (!user) {
         navigate("/login");
         return;
      }
      if (habitList.length > 0) {
         return;
      }
      axios
         .get(`${conf.BACKEND_URL}/api/v1/steak/habit`, {
            withCredentials: true,
         })
         .then((data) => {
            dispatch(addListHabits(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);

   useEffect(() => {
      if (streakList[`${month}-${year}`]) return;
      axios
         .post(
            `${conf.BACKEND_URL}/api/v1/steak/streak-list`,
            { month, year },
            {
               withCredentials: true,
            }
         )
         .then((data) => {
            for (let i = 0; i < data?.data?.data.length; i++) {
               dispatch(addSteak(data?.data?.data[i]));
            }
         })
         .catch((err) => console.log(err));
   }, [month, year]);

   const daysInMonth = (m) => {
      const days = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];
      if (m == 1) {
         year % 400 == 0
            ? (days[1] = 29)
            : year % 100 == 0
            ? (days[1] = 28)
            : year % 4 == 0
            ? (days[1] = 29)
            : (days[1] = 28);
      }
      return days[m];
   };

   const checkDate = (data, index) => {
      const utcdate = Date.UTC(year, month, index + 1, 12, 0, 0, 0);
      const indexDate = new Date(utcdate);
      const StartDate = new Date(data.startDate * 1000);
      if (indexDate > DateToday || indexDate < StartDate) {
         return null;
      }

      let list = streakList[`${month}-${year}`];
      let done = false;
      if (list) {
         if (list[data._id]) {
            let check = list[data._id]?.daysCompleted.includes(index + 1);
            if (check) {
               done = true;
            }
            let checkFreez = list[data._id]?.daysCompleted.includes(
               index + 101
            );
            if (checkFreez) {
               return (
                  <div className="size-6 m-auto flex justify-center items-center">
                     <PiFireFill className="size-6 text-blue-500" />
                  </div>
               );
            }
         }
      }

      if (data.habitType == "negative") {
         done = !done;
      }

      if (
         StartDate.getDate() === indexDate.getDate() &&
         StartDate.getMonth() === indexDate.getMonth() &&
         StartDate.getFullYear() === indexDate.getFullYear()
      ) {
         return (
            <div
               className={`${
                  done ? "text-green-500" : "text-red-500"
               } m-auto size-6 rounded-md flex justify-center items-center font-bold`}
            >
               Start
            </div>
         );
      }
      return (
         <div className="size-6 m-auto flex justify-center items-center">
            {done ? (
               <FaRegCheckCircle className="size-6 text-green-500" />
            ) : (
               <SlClose className="size-6 text-red-500" />
            )}
         </div>
      );
   };

   const changeMonth = (i) => {
      let tempMonth = month + i;
      if (tempMonth > 11) {
         setYear((prev) => prev + 1);
         tempMonth = 0;
      }
      if (tempMonth < 0) {
         setYear((prev) => prev - 1);
         tempMonth = 11;
      }
      setMonth(tempMonth);
   };

   return (
      <div className="w-full p-2 md:p-6 mt-3">
         <h1 className="text-center text-xl font-semibold my-3 text-blue-500 underline underline-offset-2">
            Habits Streak
         </h1>
         <div className="flex justify-between text-xl font-bold items-center gap-2 mb-6 w-fit bg-gray-50 dark:bg-gray-800 m-auto px-5 h-10 rounded-lg">
            <button onClick={() => changeMonth(-1)} className="size-6">
               <IoIosArrowForward className="rotate-180" />
            </button>
            <div className="font-normal">{`${monthsName[month]} ${year}`}</div>
            <button onClick={() => changeMonth(1)} className="size-6">
               <IoIosArrowForward className="" />
            </button>
         </div>
         <Table className="md:p-6 border border-gray-200 rounded-md">
            <TableCaption>
               {habitList.length === 0
                  ? "Add habit to see here"
                  : "A list of your Daily Habits."}
            </TableCaption>
            <TableHeader className="bg-violet-50 dark:bg-gray-950">
               <TableRow>
                  <TableHead className="w-[100px]">Day/ Habit</TableHead>
                  {habitList.map((item) => {
                     if (item.habitType != "todo") {
                        return (
                           <TableHead key={item._id} className="w-[100px]">
                              {item.name}
                           </TableHead>
                        );
                     }
                  })}
               </TableRow>
            </TableHeader>
            <TableBody className="text-center">
               {Array(daysInMonth(month))
                  .fill(0)
                  .map((_, i) => (
                     <TableRow key={`day-${i + 1}`}>
                        <TableCell>{`${i + 1}`}</TableCell>
                        {habitList.map((item) => {
                           if (item.habitType != "todo") {
                              return (
                                 <TableCell
                                    key={item._id}
                                    className="align-center"
                                 >
                                    {checkDate(item, i)}
                                 </TableCell>
                              );
                           }
                        })}
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
