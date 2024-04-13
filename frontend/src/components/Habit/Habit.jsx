import { useEffect } from "react";
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
import { addListHabits, deleteHabit } from "@/store/HabitSlice";
import MarkSteak from "./MarkSteak";
function Habit() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
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

   const deleteHabitHandler = async (id) => {
      axios
         .post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/habit-d`,
            { id },
            {
               withCredentials: true,
            }
         )
         .then((data) => {
            dispatch(deleteHabit(id));
         })
         .catch((err) => console.log(err));
   };
   const editHabitHandler = async (id) => {
      navigate(`/habit/${id}`);
   };
   return (
      <div className="w-full p-2 md:p-6 mt-3">
         <h1 className="text-center text-xl font-semibold my-3 text-blue-500 underline underline-offset-2">
            Habit List
         </h1>
         <Table className="md:p-6 text-center">
            <TableCaption>
               {habitList.length === 0
                  ? "Add habit to see here"
                  : "A list of your Daily Habits."}
            </TableCaption>
            <TableHeader className="bg-gray-50">
               <TableRow>
                  <TableHead>mark</TableHead>
                  <TableHead>Habit</TableHead>
                  <TableHead className="md:w-[300px]">Description</TableHead>
                  <TableHead className="md:w-[100px]">Start Time</TableHead>
                  <TableHead className="md:w-[100px]">End Time</TableHead>
                  <TableHead className="md:w-[100px]">Duration</TableHead>
                  <TableHead className="md:w-[100px]">Place</TableHead>
                  <TableHead>How</TableHead>
                  <TableHead>If Then</TableHead>
                  <TableHead className="md:w-[50px]">Points</TableHead>
                  <TableHead className=""></TableHead>
                  <TableHead className=""></TableHead>
               </TableRow>
            </TableHeader>
            <TableBody className="text-center">
               {habitList.map((item) => (
                  <TableRow key={item._id}>
                     <TableCell>
                        <MarkSteak data={item}/>
                     </TableCell>
                     <TableCell className="font-medium">{item.name}</TableCell>
                     <TableCell>{item.description}</TableCell>
                     <TableCell>{item.startTime}</TableCell>
                     <TableCell>{item.endTime}</TableCell>
                     <TableCell>{item.duration}</TableCell>
                     <TableCell>{item.place}</TableCell>
                     <TableCell>{item.how}</TableCell>
                     <TableCell>{item.ifthen}</TableCell>
                     <TableCell>{item.point}</TableCell>
                     <TableCell className="p-0">
                        <img
                           src="./edit.svg"
                           className="size-4 md:size-6 object-cover overflow-hidden fill-red-500 cursor-pointer"
                           onClick={() => editHabitHandler(item._id)}
                        ></img>
                     </TableCell>
                     <TableCell className="p-0 mr-1">
                        <img
                           src="./delete.svg"
                           className="size-4 md:size-6 object-cover overflow-hidden fill-red-500 cursor-pointer"
                           onClick={() => deleteHabitHandler(item._id)}
                        ></img>
                     </TableCell>
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

export default Habit;
