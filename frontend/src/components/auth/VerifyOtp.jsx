import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { conf } from "@/conf/conf";
import { PasswordReset } from "./PasswordReset";

export default function VerifyOtp() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const id = searchParams.get("id");
   const type = searchParams.get("type");
   const [otpVal, setotpVal] = useState();
   const [open, setOpen] = useState(false);
   const [val, setval] = useState();
   const HandelOtp = (value) => {
      setotpVal(value);
      let o = Number(value);
      if (o && o > 99999) {
         let data = { otp: o, id, type };
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
               if (type == "forgot-password") {
                  setval(data.data.data);
                  setOpen(true);
               } else {
                  navigate("/login");
               }
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
         <PasswordReset open={open} onClose={() => setOpen(false)} val={val} />
      </div>
   );
}
