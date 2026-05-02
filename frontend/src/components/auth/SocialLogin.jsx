import { SocialLogin } from "@capgo/capacitor-social-login";
import { conf } from "@/conf/conf";

await SocialLogin.initialize({
   google: {
      webClientId: conf.GOOGLE_CLIENT_ID,
      iOSClientId: conf.GOOGLE_CLIENT_ID,
      iOSServerClientId: conf.GOOGLE_CLIENT_ID,
      mode: "offline",
   },
});

export async function SocialLoginProvider() {
   console.log("SocialLoginProvider");
   const response = await SocialLogin.login({
      provider: "google",
      options: {
         // forceRefreshToken: true,
         scopes: ["email", "profile"],
      },
   });
   console.log("response", response);
   if (!response || !response.result) {
      return null;
   }
   return response.result;
}
