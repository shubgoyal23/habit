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
import EditSteak from "./EditSteak";
import toast from "react-hot-toast";
function Steak() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.auth.loggedin);
   const habitList = useSelector((state) => state.habit) || [];
   const [month, setMonth] = useState(new Date().getMonth());
   const [year, setYear] = useState(new Date().getFullYear());
   const [showEdit, setShowEdit] = useState(false);
   const [editData, setShowEditData] = useState({});

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
   const daysInMonth = (m) => {
      const days = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];
      if (m == 1) {
         year / 400
            ? (days[1] = 29)
            : year / 100
            ? (days[1] = 28)
            : year / 4
            ? (days[1] = 29)
            : (days[1] = 28);
      }
      return days[m];
   };

   useEffect(() => {
      if (!user) {
         navigate("/login");
      }
      toast("Double Click on Mark to Edit it!", {
         icon: "🖱️",
      });
      axios
         .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/habit`, {
            withCredentials: true,
         })
         .then((data) => {
            dispatch(addListHabits(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);

   const DateToday = new Date();
   const checkDate = (data, index) => {
      const indexDate = new Date(year, month, index + 1);
      const StartDate = new Date(data.startDate);
      if (indexDate > DateToday) {
         return null;
      }
      if (
         StartDate.getDate() === indexDate.getDate() &&
         StartDate.getMonth() === indexDate.getMonth() &&
         StartDate.getFullYear() === indexDate.getFullYear()
      ) {
         return (
            <div className="bg-yellow-400 m-auto size-6 rounded-md flex justify-center items-center">
               S
            </div>
         );
      }
      if (indexDate < StartDate) {
         return null;
      }

      let check = data.daysCompleted.find((items) => {
         const item = new Date(items);
         if (
            item.getDate() === indexDate.getDate() &&
            item.getMonth() === indexDate.getMonth() &&
            item.getFullYear() === indexDate.getFullYear()
         ) {
            return item;
         }
      });
      if (check) {
         return (
            <div
               onDoubleClick={() => {
                  setShowEdit(true);
                  setShowEditData({
                     _id: data._id,
                     mark: true,
                     date: indexDate,
                  });
               }}
               className="bg-green-400 size-6 cursor-pointer m-auto rounded-md flex justify-center items-center"
            >
               <img src="./check.svg" className="size-5"></img>
            </div>
         );
      }
      return (
         <div
            onDoubleClick={() => {
               setShowEdit(true);
               setShowEditData({ _id: data._id, mark: false, date: indexDate });
            }}
            className="bg-red-500 size-6 cursor-pointer m-auto rounded-md flex justify-center items-center"
         >
            <img src="./cross.svg" className="size-5"></img>
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
         {showEdit && (
            <EditSteak data={editData} open={showEdit} edit={setShowEdit} />
         )}
         <h1 className="text-center text-xl font-semibold my-3 text-blue-500 underline underline-offset-2">
            Habits Streak
         </h1>
         <div className="flex justify-between text-xl font-bold items-center gap-2 mb-6 w-60 bg-gray-50 m-auto px-5 h-10 rounded-lg">
            <button onClick={() => changeMonth(-1)} className="size-6">
               <img src="./arrowL.svg" alt="arrow left" />
            </button>
            <div className="font-normal">{`${monthsName[month]} ${year}`}</div>
            <button onClick={() => changeMonth(1)} className="size-6">
               <img src="./arrowR.svg" alt="arrow right" />
            </button>
         </div>
         <Table className="md:p-6 border border-gray-200 rounded-md">
            <TableCaption>
               {habitList.length === 0
                  ? "Add habit to see here"
                  : "A list of your Daily Habits."}
            </TableCaption>
            <TableHeader className="bg-violet-50">
               <TableRow>
                  <TableHead className="w-[100px]">Day/ Habit</TableHead>
                  {habitList.map((item) => (
                     <TableHead key={item._id} className="w-[100px]">
                        {item.name}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>
            <TableBody className="text-center">
               {Array(daysInMonth(month))
                  .fill(0)
                  .map((_, i) => (
                     <TableRow key={`day-${i + 1}`}>
                        <TableCell>{`${i + 1}-${month + 1}-${year}`}</TableCell>
                        {habitList.map((item) => (
                           <TableCell key={item._id} className="align-center">
                              {checkDate(item, i)}
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
