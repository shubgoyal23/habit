import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

function Navigate() {
   const navigate = useNavigate();

   useEffect(() => {
      if (!Capacitor.isNativePlatform()) return;

      App.getInfo().then((info) => {
         console.log(info);
      });

      const backButtonListener = App.addListener(
         "backButton",
         ({ canGoBack }) => {
            if (canGoBack) {
               navigate(-1); // Navigate back if possible
            } else {
               App.exitApp(); // Exit the app if no history
            }
         }
      );

      return () => {
         backButtonListener.remove(); // Clean up the event listener
      };
   }, [navigate]);
   return null;
}

export default Navigate;
