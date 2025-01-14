// import { setTheme } from "@/store/ThemeSlice";
// import React, { useEffect, useState } from "react";
// import {
//    CiBrightnessDown as Moon,
//    CiBrightnessUp as Sun,
// } from "react-icons/ci";
// import { useDispatch, useSelector } from "react-redux";

// function Theme() {
//    const userTheme = useSelector((state) => state.userTheme);
//    const dispatch = useDispatch();

//    function themeswitch(theme) {
//       if (
//          theme === "dark" ||
//          (theme === "system" &&
//             window.matchMedia("(prefers-color-scheme: dark)").matches)
//       ) {
//          document.documentElement.classList.add("dark");
//          dispatch(setTheme("dark"));
//          localStorage.setItem("theme", "dark");
//       } else {
//          dispatch(setTheme("light"));
//       }
//    }

//    useEffect(() => {
//       themeswitch(userTheme);
//    }, []);

//    const handleThemeChange = () => {
//       const newMode = mode === "dark" ? "light" : "dark";
//       themeswitch(newMode);
//       setMode(newMode);
//    };

//    return (
//       <>
//          <button
//             className=" flex items-center gap-3"
//             onClick={handleThemeChange}
//          >
//             {mode === "dark" ? <Sun /> : <Moon />}
//          </button>
//       </>
//    );
// }

// export default Theme;
