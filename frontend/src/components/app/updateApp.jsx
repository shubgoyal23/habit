import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import React from "react";

function UpdateApp() {
   const updateApp = async () => {
      if (!Capacitor.isNativePlatform()) return;
      let storeUrl = "";
      if (Capacitor.getPlatform() === "android") {
         storeUrl =
            "https://play.google.com/store/apps/details?id=com.proteinslice.habit"; // Replace with your package name
      }
      try {
         await App.openUrl({ url: storeUrl });
      } catch (error) {
         console.error("Error opening store:", error);
      }
   };
   return (
      <div className="w-screen h-screen fixed top-0 left-0 bg-black/80 flex justify-center items-center z-50">
         <div className="max-w-sm w-full h-40 bg-white dark:bg-gray-950 p-4 rounded-lg text-center flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-2">App Ypdate Required</h1>
            <p className="text-sm px-2">
               Kindly update your app to the latest version to continue using
               it.
            </p>
            <button
               onClick={updateApp}
               className="mt-4 bg-gray-500 px-3 py-1 rounded"
            >
               Update App
            </button>
         </div>
      </div>
   );
}

export default UpdateApp;
