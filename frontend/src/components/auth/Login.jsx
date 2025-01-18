import {
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   Card,
   CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as authlogin } from "../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { conf } from "@/conf/conf";
import { setTokenToStorageAndAxios } from "@/lib/apphelper";
import {
   RegisterForNotifications,
   sendFcmTokenToServer,
} from "@/lib/notification";

export default function Login() {
   const [showPass, setShowPass] = useState(false);
   const isloggedin = useSelector((state) => state.auth.loggedin);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const AppSpecific = async (data) => {
      await setTokenToStorageAndAxios(data); // for app
      await RegisterForNotifications();
      await sendFcmTokenToServer();
   };

   useEffect(() => {
      if (isloggedin) {
         navigate("/");
      }
   }, [isloggedin]);

   const onSubmit = (data) => {
      const login = axios.post(`${conf.BACKEND_URL}/api/v1/users/login`, data, {
         withCredentials: true,
      });

      toast.promise(login, {
         loading: "Loading",
         success: "Login successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      login
         .then((data) => {
            dispatch(authlogin(data.data.data));
            AppSpecific(data.data.data);
            navigate("/");
         })
         .catch((err) => console.log(err));
   };

   return (
      <div className="w-full flex justify-center items-center my-10">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Login</CardTitle>
               <CardDescription>
                  Enter your email and password to login to your account
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
                     <div className="flex items-center space-x-2 pt-1">
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
                        Login
                     </Button>
                  </div>
               </form>
               <CardFooter className="p-0 pt-1 justify-between">
                  <Link
                     className="text-gray-500 hover:text-blue-500 ml-1"
                     to={"/reset?id=verify-email"}
                  >
                     Verify Email
                  </Link>
                  <Link
                     className="text-gray-500 hover:text-blue-500 ml-1"
                     to={"/reset?id=forgot-password"}
                  >
                     Forget Password
                  </Link>
               </CardFooter>
               <CardFooter className="pt-4 justify-center">
                  Don't have Account?
                  <Link className="text-blue-500 ml-1" to={"/register"}>
                     Create One
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
