import React from "react";
import { Button } from "../ui/button";
import { SocialLoginProvider } from "./SocialLogin";

function GoogleLoginApp({ SocialLogin }) {
   const login = async () => {
      const result = await SocialLoginProvider();
      const token = result?.serverAuthCode;
      await SocialLogin({ token, provider: "google" });
   };
   return (
      <div className="w-full my-2">
         <Button className="w-full flex gap-1" type="button" onClick={login}>
            <img
               src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
               alt="google logo"
            />
            Sign in with Google
         </Button>
      </div>
   );
}

export default GoogleLoginApp;
