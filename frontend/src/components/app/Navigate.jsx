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
      const { build } = await App.getInfo();

      axios.get(`${conf.BACKEND_URL}/api/v1/app/version`).then((data) => {
         let leastAppVersion = Number(data?.data?.data?.version);
         let versionNumber = Number(build);
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
