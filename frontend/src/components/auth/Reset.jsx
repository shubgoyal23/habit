import { Link, Navigate, useSearchParams } from "react-router-dom";
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

export function ResetPage() {
   const [searchParams] = useSearchParams();
   const id = searchParams.get("id");
   let head = "Reset Password";
   if (!id) {
      return <Navigate to="/login" />;
   } else if (id == "1abvm") {
      head = "Verify Email";
   } else if (id == "2abfp") {
      head = "Reset Password";
   }
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const onSubmit = (data) => {
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
            Navigate(`/verify?id=${data.data.data._id}&type=${id}`);
         })
         .catch((err) => console.log(err));
   };
   return (
      <div className="w-full flex justify-center items-center my-10">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">{head}</CardTitle>
               <CardDescription>
                  Enter your email an otp will be sent on this email to verify
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
