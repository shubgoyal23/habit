import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { conf } from "@/conf/conf";

export function OTPPage() {
   const [searchParams] = useSearchParams();
   const id = searchParams.get("id");
   const [otpVal, setotpVal] = useState();
   const HandelOtp = (value) => {
      setotpVal(value);
      let o = Number(value);
      if (o && o > 99999) {
         let data = { otp: o, id };
         const checkOtp = axios.post(
            `${conf.BACKEND_URL}/api/v1/users/verify`,
            data,
            {
               withCredentials: true,
            }
         );

         toast.promise(checkOtp, {
            loading: "Loading",
            success: "Otp Verified Successfully",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         checkOtp
            .then((data) => {
               Navigate("/login");
            })
            .catch((err) => console.log(err));
      }
   };
   return (
      <div className="w-full h-[60svh] flex justify-center items-center flex-col">
         <h1 className="mb-2">Enter OTP</h1>
         <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otpVal}
            onChange={(value) => HandelOtp(value)}
         >
            <InputOTPGroup>
               <InputOTPSlot index={0} />
               <InputOTPSlot index={1} />
               <InputOTPSlot index={2} />
               <InputOTPSlot index={3} />
               <InputOTPSlot index={4} />
               <InputOTPSlot index={5} />
            </InputOTPGroup>
         </InputOTP>
      </div>
   );
}
