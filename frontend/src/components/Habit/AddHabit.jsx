import React, { useEffect } from "react";
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
import { login as authlogin } from "../../store/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function AddHabit() {
   let { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const userData =
      useSelector((state) => state.auth?.userDate?.taskList) || [];
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm();

   useEffect(() => {
      if (id && id !== "new") {
         const data = userData.find((item) => item._id === id);
         if (data) {
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("time", data.time);
            setValue("place", data.place);
            setValue("how", data.how);
            setValue("ifthen", data.ifthen);
            setValue("point", data.point);
         }
      }
   }, [userData]);

   const onSubmit = (data) => {
      if (id === "new") {
         const addHAbit = axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/habit`,
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
               dispatch(authlogin(data.data.data));
               navigate(`/habit`);
            })
            .catch((err) => console.log(err));
      } else {
         const addHAbit = axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/steak/habit`,
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
            .then((data) => {dispatch(authlogin(data.data.data))
            navigate("/habit")})
            .catch((err) => console.log(err));
      }
   };

   return (
      <div className="w-full min-h-screen flex justify-center items-center">
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
                        <Label htmlFor="time">Time</Label>
                        <Input
                           id="time"
                           placeholder="1:00 PM"
                           type="time"
                           {...register("time")}
                        />
                     </div>
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
               <CardFooter className="pt-3 justify-center">
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
