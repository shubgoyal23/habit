import React from "react";
import { useNavigate } from "react-router-dom";
import { addHabit, deleteHabit } from "@/store/HabitSlice";
import { addArchive,deleteArchive } from "@/store/ArchiveSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { conf } from "@/conf/conf";
import { EllipsisVertical } from "lucide-react";

function Action({ row }) {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const habit = row.original;

   const deleteHabitHandler = async (id) => {
      let delhabt = axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/habit-d`,
         { id },
         {
            withCredentials: true,
         }
      );
      toast.promise(delhabt, {
         loading: "Deleting habit..",
         success: "Deleted successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      delhabt
         .then((data) => {
            dispatch(deleteHabit(id));
            dispatch(deleteArchive(id));
         })
         .catch((err) => console.log(err));
   };
   const editHabitHandler = async (id) => {
      navigate(`/habit/${id}`);
   };
   const ArchiveHabit = async (id) => {
      let delhabt = axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/habit-a`,
         { id },
         {
            withCredentials: true,
         }
      );
      toast.promise(delhabt, {
         loading: "Archiving habit..",
         success: "Archived successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      delhabt
         .then((data) => {
            dispatch(deleteHabit(id));
            dispatch(addArchive(habit));
         })
         .catch((err) => console.log(err));
   };

   const duplicateHabit = () => {
      const data = {
         ...habit,
         name: `${habit.name}-copy`,
         startDate: new Date(),
      };
      const addHAbit = axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/habit`,
         data,
         { withCredentials: true }
      );

      toast.promise(addHAbit, {
         loading: "Loading",
         success: "Habit Duplicated successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      addHAbit
         .then((data) => {
            dispatch(addHabit(data.data.data));
            navigate(`/habit-list`);
         })
         .catch((err) => console.log(err));
   };
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Open menu</span>
               <EllipsisVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
               <Link to={"/steak"}>View Streak</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editHabitHandler(habit._id)}>
               Edit Habit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateHabit()}>
               Duplicate Habit
            </DropdownMenuItem>
            {habit.isActive && (
               <DropdownMenuItem onClick={() => ArchiveHabit(habit._id)}>
                  Archive Habit
               </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => deleteHabitHandler(habit._id)}>
               Delete Habit
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default Action;
