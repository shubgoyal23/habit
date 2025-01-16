import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { editHabit } from "@/store/HabitSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { conf } from "@/conf/conf";
import { MdOutlineRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";

function MarkSteak({ row }) {
   const streakList = useSelector((state) => state.streak) || [];
   const data = row.original;
   const dispatch = useDispatch();
   const [marked, setmarked] = useState(false);

   const handleMarked = () => {
      const request = axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/${marked ? "remove" : "add"}`,
         { id: data._id },
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
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      if (!streakList || !data) return;
      const indexDate = new Date();
      const indexStamp = `${indexDate.getFullYear()}-${indexDate.getMonth()}-${indexDate.getDate()}`;
      let check = streakList[data._id]?.find((items) => {
         const dateStamp = items.dateStamp;
         if (indexStamp == dateStamp) {
            return items;
         }
      });
      if (check) {
         setmarked(true);
      } else {
         setmarked(false);
      }
   }, [streakList]);
   return (
      <>
         <button
            type="checkbox"
            className="size-4 cursor-pointer border-gray-200 rounded text-blue-600 focus:ring-blue-500"
            onClick={handleMarked}
         >
            {marked ? (
               <MdCheckCircle className="text-green-600 size-6" />
            ) : (
               <MdOutlineRadioButtonUnchecked className="text-gray-400 size-6" />
            )}
         </button>
      </>
   );
}

export default MarkSteak;
