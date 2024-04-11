import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { editHabit } from "@/store/HabitSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function MarkSteak({ data }) {
   const dispatch = useDispatch();
   const [marked, setmarked] = useState(false);

   const handleMarked = () => {    
       const request = axios.post(
           `${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/${marked? "remove": "add"}`,
           { id: data._id },
           {
               withCredentials: true,
            }
      );
      toast.promise(request, {
          loading: "Loading",
          success: (data) => `${data.data?.message || "Marked successfully"}`,
          error: (err) => `${err.response?.data?.message || "Something went wrong"}`,
        });
        request
        .then((data) => {
            setmarked((prev) => !prev);
            dispatch(editHabit(data.data.data));
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      const date = new Date();
      let check = data.daysCompleted.find((item) => {
         const checkDate = new Date(item);
         if (
            checkDate.getDay() === date.getDay() &&
            checkDate.getMonth() === date.getMonth() &&
            checkDate.getFullYear() === date.getFullYear()
         ) {
            return item;
         }
      });
      if (check) {
         setmarked(true);
      }
   }, []);
   return (
      <>
         <Input
            type="checkbox"
            className="size-4 cursor-pointer border-gray-200 rounded text-blue-600 focus:ring-blue-500"
            checked={marked}
            onChange={handleMarked}
         ></Input>
      </>
   );
}

export default MarkSteak;
