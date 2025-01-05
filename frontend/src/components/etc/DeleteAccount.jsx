import React, { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Link, Navigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import axios from "axios";
import { conf } from "@/conf/conf";
import { useDispatch } from "react-redux";
import { logout } from "@/store/AuthSlice";
import toast from "react-hot-toast";

function DeleteAccount() {
   const [showPass, setShowPass] = useState(false);
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      const DeleteAccount = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/close-account`,
         data,
         {
            withCredentials: true,
         }
      );

      toast.promise(DeleteAccount, {
         loading: "Loading",
         success: "Account deleted successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      DeleteAccount.then((data) => {
         Navigate("/login");
         dispatch(logout());
      }).catch((err) => console.log(err));
   };

   return (
      <div className="w-full flex justify-center items-start my-10">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">
                  Close Account
               </CardTitle>
               <CardDescription>
                  Enter your email and password to Close your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        placeholder="m@example.com"
                        required
                        type="email"
                        {...register("email")}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        required
                        type={showPass ? "text" : "password"}
                        {...register("password")}
                     />
                     <div className="flex items-center space-x-2">
                        <Checkbox
                           id="showpassword"
                           onClick={() => setShowPass((prev) => !prev)}
                        />
                        <label
                           htmlFor="showpassword"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                           Show Password
                        </label>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="confirm"
                        {...register("confirm", { required: true })}
                     />
                     <label
                        htmlFor="showpassword"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        I confirm to close my account Permanently
                     </label>
                  </div>
                  <Button className="w-full" type="submit">
                     Close Account Permanently
                  </Button>
               </form>
               <CardFooter className="pt-3 justify-center">
                  Create an New Habit
                  <Link className="text-blue-500 ml-1" to={"/habit"}>
                     Go To Habit page
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}

export default DeleteAccount;
