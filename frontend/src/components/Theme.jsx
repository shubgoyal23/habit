import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function Theme() {
   const [mode, setMode] = useState("");

   function themeswitch(theme) {
      if (
         theme === "dark" ||
         (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
         document.documentElement.classList.add("dark");
         localStorage.setItem("theme", "dark");
         setMode("dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("theme", "light");
         setMode("light");
      }
   }

   useEffect(() => {
      let theme = localStorage.getItem("theme");
      if (theme) {
         themeswitch(theme);
      } else {
         themeswitch("system");
      }
   }, []);

   const handleThemeChange = () => {
      const newMode = mode === "dark" ? "light" : "dark";
      themeswitch(newMode);
      setMode(newMode);
   };

   return (
      <>
         <button
            className="text-2xl font-medium py-2 px-2 flex justify-center items-center"
            onClick={handleThemeChange}
         >
            {mode === "dark" ? <Sun /> : <Moon />}
            {/* <span className="md:hidden ml-2">{mode}</span> */}
         </button>
      </>
   );
}

export default Theme;
