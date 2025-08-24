import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { conf } from "@/conf/conf";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

export default function ResetPage() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const id = searchParams.get("id");
   let head = "Reset Password";
   if (!id) {
      return <Navigate to="/login" />;
   } else if (id == "verify-email") {
      head = "Verify Email";
   } else if (id == "forgot-password") {
      head = "Reset Password";
   }
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const onSubmit = (data) => {
      data.type = id;
      const checkOtp = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/resend-otp`,
         data,
         {
            withCredentials: true,
         }
      );

      toast.promise(checkOtp, {
         loading: "Loading",
         success: "Otp Sent Successfully",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      checkOtp
         .then((data) => {
            navigate(`/verify?id=${data.data.data._id}&type=${id}`);
         })
         .catch((err) => console.log(err));
   };
   return (
      <div className="w-full flex justify-center items-center h-full">
         <Card className="mx-auto max-w-md w-full">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">{head}</CardTitle>
               <CardDescription>
                  Enter your email an otp will be sent on this email to verify
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                     <Label htmlFor="email" className="pl-3">Email</Label>
                     <Input
                        id="email"
                        placeholder="m@example.com"
                        required
                        type="email"
                        {...register("email")}
                     />
                  </div>
                  <div className="w-full pt-4">
                     <Button className="w-full" type="submit">
                        {head}
                     </Button>
                  </div>
               </form>
               <CardFooter className="pt-4 justify-center">
                  Go Back to
                  <Link className="text-blue-500 mx-1" to={"/login"}>
                     Login
                  </Link>
                  page
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
