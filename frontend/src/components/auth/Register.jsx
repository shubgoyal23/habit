import {
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   CardFooter,
   Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { conf } from "@/conf/conf";

export default function Register() {
   const [showPass, setShowPass] = useState(false);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      data.timeZone = new Date().getTimezoneOffset();
      const register = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/register`,
         data,
         { withCredentials: true },
      );

      toast.promise(register, {
         loading: "Loading",
         success: "OTP Sent to Email ID",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      register
         .then((data) =>
            navigate(`/verify?id=${data.data.data._id}&type=register`),
         )
         .catch((err) => console.log(err));
   };

   return (
      <div className="w-full flex justify-center items-center h-full">
         <Card className="pt-10 md:pt-0 mx-auto max-w-md w-full">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Register</CardTitle>
               <CardDescription>
                  Enter your email and password to Create an account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-2 items-center justify-between">
                     <div className="space-y-2">
                        <Label className="pl-3" htmlFor="firstName">
                           First Name
                        </Label>
                        <Input
                           id="firstName"
                           placeholder="first Name"
                           required
                           type="text"
                           {...register("firstName")}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="pl-3" htmlFor="lastName">
                           Last Name
                        </Label>
                        <Input
                           id="lastName"
                           placeholder="last Name"
                           required
                           type="text"
                           {...register("lastName")}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="pl-3" htmlFor="email">
                        Email
                     </Label>
                     <Input
                        id="email"
                        placeholder="m@example.com"
                        required
                        type="email"
                        {...register("email")}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="pl-3" htmlFor="password">
                        Password
                     </Label>
                     <Input
                        id="password"
                        required
                        type={showPass ? "text" : "password"}
                        {...register("password")}
                     />
                     <div className="flex items-center space-x-2 pt-1 pl-3">
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
                  <div className="w-full pt-4">
                     <Button className="w-full" type="submit">
                        Create Account
                     </Button>
                  </div>
               </form>

               <CardFooter className="pt-4 justify-center">
                  Already have Account?
                  <Link className="text-blue-500 ml-1" to={"/login"}>
                     Login
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
