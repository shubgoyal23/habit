import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { conf } from "@/conf/conf";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function PasswordReset({ open, onClose, val }) {
   const [showPass, setShowPass] = useState(false);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const onSubmit = (data) => {
      if (data.password != data.confirmpassword) {
         toast.error("Password and Confirm Password does not match");
         return;
      }
      val.password = data.password;
      const resetPassword = axios.post(`${conf.BACKEND_URL}/api/v1/users/forgot-password`, val, {
         withCredentials: true,
      });

      toast.promise(resetPassword, {
         loading: "Loading",
         success: "Password Reset Successfully",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      resetPassword
         .then((data) => {
            navigate("/login");
         })
         .catch((err) => console.log(err));
   };
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Reset Password</DialogTitle>
               <DialogDescription>
                  Enter Password and Confirm Password to set new login password
               </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
               <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     required
                     type="password"
                     {...register("password")}
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="password"> Confirm Password</Label>
                  <Input
                     id="confirmpassword"
                     required
                     type={showPass ? "text" : "password"}
                     {...register("confirmpassword")}
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
               <div className="w-full py-4">
                  <Button className="w-full" type="submit">
                     Reset Password
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
