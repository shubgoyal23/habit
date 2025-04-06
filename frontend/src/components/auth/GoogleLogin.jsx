import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { conf } from "@/conf/conf";
import { Button } from "../ui/button";

function GoogleLoginApp({ LoginWithGoogle }) {
   return (
      <div className="w-full my-2">
         <GoogleOAuthProvider clientId={conf.GOOGLE_CLIENT_ID}>
            <GoogleLoginAppaa LoginWithGoogle={LoginWithGoogle} />
         </GoogleOAuthProvider>
      </div>
   );
}

function GoogleLoginAppaa({ LoginWithGoogle }) {
   const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
         LoginWithGoogle({ token: codeResponse.code });
      },
      flow: "auth-code",
   });
   return (
      <div className="w-full my-2">
         <Button
            className="w-full flex gap-1"
            type="button"
            onClick={() => login()}
         >
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
