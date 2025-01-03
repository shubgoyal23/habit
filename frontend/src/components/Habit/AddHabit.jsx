import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   Card,
   CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addHabit, editHabit } from "@/store/HabitSlice";
import { conf } from "@/conf/conf";

export default function AddHabit() {
   const user = useSelector((state) => state.auth.loggedin);
   let { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const userData = useSelector((state) => state.habit) || [];
   const { register, handleSubmit, setValue, getValues } = useForm();
   const [timeEdit, setTimeEdit] = useState(null);

   useEffect(() => {
      const sTime = getValues("startTime");
      const start = sTime.split(":");
      const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
      if (sTime && timeEdit?.type == "endTime") {
         const end = timeEdit?.val?.split(":");
         const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
         const diff = endDate.getTime() - startDate.getTime();
         const dur = Math.round(diff / 60000);
         setValue("duration", dur);
      }
      if (sTime && timeEdit?.type == "duration") {
         const dur = timeEdit?.val * 60000;
         const end = new Date(startDate.getTime() + dur);
         setValue("endTime", `${end.getHours()}:${end.getMinutes()}`);
      }
   }, [timeEdit]);

   useEffect(() => {
      if (id && id !== "new") {
         const data = userData.find((item) => item._id === id);
         if (data) {
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("startTime", data.startTime);
            setValue("endTime", data.endTime);
            setValue("duration", data.time);
            setValue("place", data.place);
            setValue("how", data.how);
            setValue("ifthen", data.ifthen);
            setValue("point", data.point);
         }
      }
   }, [userData]);

   useEffect(() => {
      if (!user) {
         navigate("/login");
      }
   }, []);

   const onSubmit = (data) => {
      if (id === "new") {
         const addHAbit = axios.post(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            data,
            { withCredentials: true }
         );

         toast.promise(addHAbit, {
            loading: "Loading",
            success: "Habit added successfull",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         addHAbit
            .then((data) => {
               dispatch(addHabit(data.data.data));
               navigate(`/habit`);
            })
            .catch((err) => console.log(err));
      } else {
         const addHAbit = axios.patch(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            { id: id, ...data },
            { withCredentials: true }
         );

         toast.promise(addHAbit, {
            loading: "Loading",
            success: "Habit Edited successfull",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         addHAbit
            .then((data) => {
               dispatch(editHabit(data.data.data));
               navigate("/habit");
            })
            .catch((err) => console.log(err));
      }
   };

   return (
      <div className="w-full flex justify-center items-start">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">
                  {id === "new" ? "Create Habit" : "Edit Habit"}
               </CardTitle>
               <CardDescription>
                  Enter Full details to get most out of this App
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="">
                     <Label htmlFor="name">Habit Name</Label>
                     <Input
                        id="name"
                        placeholder="Read Book"
                        required
                        type="text"
                        {...register("name")}
                     />
                  </div>
                  <div className="">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Read Book Daily for 15 min in Morning"
                        type="textarea"
                        {...register("description")}
                     />
                  </div>
                  <div className="flex gap-2 items-center justify-between">
                     <div>
                        <Label htmlFor="place">Place</Label>
                        <Input
                           id="place"
                           placeholder="Bed Room"
                           type="text"
                           {...register("place")}
                        />
                     </div>
                     <div>
                        <Label htmlFor="point">Points</Label>
                        <Input
                           id="point"
                           placeholder="2"
                           required
                           type="number"
                           {...register("point")}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center justify-between">
                     <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                           id="startTime"
                           placeholder="1:00 PM"
                           type="time"
                           {...register("startTime")}
                        />
                     </div>
                     <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                           id="endTime"
                           placeholder="1:00 PM"
                           type="time"
                           {...register("endTime")}
                           onChange={(e) => setTimeEdit({ type: "endTime" , val: e.target.value })}
                        />
                     </div>
                     <div>
                        <Label htmlFor="time">Duration</Label>
                        <Input
                           id="time"
                           placeholder="60 min"
                           type="number"
                           {...register("duration")}
                           onChange={(e) => setTimeEdit({ type: "duration", val: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="how">How you will do it</Label>
                     <Input
                        id="how"
                        placeholder="Morning just befor Tea/Coffee"
                        type="text"
                        {...register("how")}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="ifthen">If not done then?</Label>
                     <Input
                        id="ifthen"
                        type="text"
                        placeholder="if not complete then 30 min extra after lunch"
                        {...register("ifthen")}
                     />
                  </div>
                  <Button className="w-full" type="submit">
                     {id === "new" ? "Create Habit" : "Edit Habit"}
                  </Button>
               </form>
               <CardFooter className="p-3 justify-center">
                  Return Back to Habit Page
                  <Link className="text-blue-500 ml-1" to={"/habit"}>
                     Click Here
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
