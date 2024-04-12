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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
   const [showPass, setShowPass] = useState(false);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      const register = axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
         data, {withCredentials: true}
      );

      toast.promise(register, {
         loading: "Loading",
         success: "Registration successfull",
         error: (err) => `${err.response?.data?.message || "Something went wrong"}`,
      });
      register
         .then((data) => navigate("/login"))
         .catch((err) => console.log(err));
   };

   return (
      <div className="w-full min-h-screen flex justify-center md:items-center items-start mt-10">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Register</CardTitle>
               <CardDescription>
                  Enter your email and password to Create an account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-2 items-center justify-between">
                     <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                           id="firstName"
                           placeholder="first Name"
                           required
                           type="text"
                           {...register("firstName")}
                        />
                     </div>
                     <div>
                        <Label htmlFor="lastName">Last Name</Label>
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
                  <Button className="w-full" type="submit">
                     Create Account
                  </Button>
               </form>

               <CardFooter className="pt-3 justify-center">
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
