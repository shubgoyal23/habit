import React, { useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { editHabit } from "@/store/HabitSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

function EditSteak({ edit, data, open }) {
   const [marked, setmarked] = useState(data.mark);
   const dispatch = useDispatch();
   const handleMarked = () => {
      const request = axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/${
            marked ? "remove" : "add"
         }`,
         { id: data._id, date: data.date },
         {
            withCredentials: true,
         }
      );
      toast.promise(request, {
         loading: "Loading",
         success: (data) => `${data.data?.message || "Marked successfully"}`,
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      request
         .then((data) => {
            setmarked((prev) => !prev);
            dispatch(editHabit(data.data.data));
            edit(false)
         })
         .catch((err) => console.log(err));
   };
   return (
      <Dialog open={open} onOpenChange={edit}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Are you absolutely sure?</DialogTitle>
               <DialogDescription className="flex pt-6">
                  <Input
                     type="checkbox"
                     className="size-4 mr-2 cursor-pointer border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                     checked={marked}
                     onChange={handleMarked}
                  ></Input>
                  <span>Mark Habit as</span>
                  <span className="mx-1 font-semibold text-black">
                     {" "}
                     {data.mark ? "Incomplete" : "Completed"}{" "}
                  </span>
                  <span className="mx-1"> for </span>
                  <span className="text-gray-700">
                     {data.date.getDate()}-{data.date.getMonth() + 1}-
                     {data.date.getFullYear()}
                  </span>
               </DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   );
}

export default EditSteak;

{
   /* <div
         className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-50 flex justify-center items-center"
         onClick={(e) => {
            e.stopPropagation();
            edit(false);
         }}
      >
         <div
            className="w-72 h-28 bg-white border-2 border-gray-400 rounded-lg relative"
            onClick={(e) => {
               e.stopPropagation();
            }}
         >
            <button
               className="absolute top-1 right-1"
               onClick={(e) => {
                  e.stopPropagation();
                  edit(false);
               }}
            >
               X
            </button>

            <h1 className="text-center my-2 text-blue-500">Edit Habit</h1>
            <div className="p-2 text-center">
               <Input
                  type="checkbox"
                  className="size-4 cursor-pointer border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                  checked={data.mark}
                  onChange={handleMarked}
               ></Input>
               <span>Mark Habit {data.mark ? "Incomplete" : "Completed"}</span>
               <span> for </span>
               <span className="text-gray-700">
                  {data.date.getDate()}/{data.date.getMonth() + 1}/
                  {data.date.getFullYear()}
               </span>
            </div>
         </div>
      </div> */
}
