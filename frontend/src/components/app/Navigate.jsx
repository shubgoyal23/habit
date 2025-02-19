import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { conf } from "@/conf/conf";
import UpdateApp from "./updateApp";

function Navigate() {
   const [update, setUpdate] = useState(false);
   const navigate = useNavigate();

   const AppVersionCheck = async () => {
      const { version } = await App.getInfo();

      axios.get(`${conf.BACKEND_URL}/api/v1/app/version`).then((data) => {
         let leastAppVersion = data?.data?.data?.version;
         leastAppVersion = leastAppVersion.split(".");
         leastAppVersion = Number(
            leastAppVersion[0] * 100 +
               leastAppVersion[1] * 10 +
               leastAppVersion[2]
         );
         let versionNumber = version.split(".");
         versionNumber = Number(
            versionNumber[0] * 100 + versionNumber[1] * 10 + versionNumber[2]
         );

         if (versionNumber < leastAppVersion) {
            setUpdate(true);
         }
      });
   };

   useEffect(() => {
      if (!Capacitor.isNativePlatform()) return;

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
      AppVersionCheck();
      return () => {
         backButtonListener.remove(); // Clean up the event listener
      };
   }, [navigate]);
   return update ? <UpdateApp /> : "";
}

export default Navigate;
