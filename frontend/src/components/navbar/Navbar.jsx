import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Theme from "../Theme";

function Navbar() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const [menu, setMenu] = useState([]);
   const [mobileNav, setMobileNav] = useState(false);

   useEffect(() => {
      !loggedin
         ? setMenu([
              { title: "Login", to: "/login" },
              { title: "Register", to: "/register" },
           ])
         : setMenu([
              { title: "Add Habit", to: "/habit/new" },
              { title: "Habits Table", to: "/habit" },
              { title: "Streak Table", to: "/steak" },
              { title: "Logout", to: "/logout" },
           ]);
   }, [loggedin]);
   return (
      <header className="fixed top-0 w-full lg:px-16 px-4 h-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg flex flex-wrap items-center py-2 shadow-md z-50">
         <div className="flex-1 flex justify-between items-center">
            <Link
               className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 text-transparent bg-clip-text"
               to={"/"}
            >
               Habit Tracker
            </Link>
         </div>
         <div
            htmlFor="menu-toggle"
            className="cursor-pointer md:hidden block"
            onClick={() => setMobileNav((prev) => !prev)}
         >
            {!mobileNav ? (
               <svg
                  className="fill-current text-gray-900 dark:text-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
               >
                  <title>menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
               </svg>
            ) : (
               <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="fill-current text-gray-900 dark:text-gray-100"
               >
                  <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z" />
               </svg>
            )}
         </div>
         <div className={`hidden md:flex md:items-center md:w-auto w-full`}>
            <nav>
               <ul className="md:flex items-center justify-between text-base text-gray-700 dark:text-gray-200 pt-4 md:pt-0">
                  {menu.map((item) => (
                     <li key={item.title}>
                        <NavLink
                           className={({ isActive }) =>
                              `${
                                 isActive ? "font-bold" : ""
                              } md:p-4 py-3 px-0 block md:mb-0 mb-2`
                           }
                           to={item.to}
                        >
                           {item.title}
                        </NavLink>
                     </li>
                  ))}
                  <li>
                     <Theme />
                  </li>
               </ul>
            </nav>
         </div>
         <div
            className={`absolute z-30 h-screen ${
               mobileNav ? "left-0" : "-left-[800px]"
            } transition-all duration-300 ease-in top-16 md:hidden bg-white/90 dark:bg-gray-950/95 backdrop-blur-2xl w-full flex justify-center pt-3 h-full`}
         >
            <nav>
               <ul className="md:flex items-center justify-between text-base text-gray-700 dark:text-gray-200 pt-4 md:pt-0">
                  {menu.map((item) => (
                     <li key={item.title}>
                        <NavLink
                           className={({ isActive }) =>
                              `${
                                 isActive ? "font-bold" : ""
                              } md:p-4 py-3 px-0 font-semibold text-xl text-center block md:mb-0 mb-2`
                           }
                           to={item.to}
                           onClick={() => setMobileNav((prev) => !prev)}
                        >
                           {item.title}
                        </NavLink>
                     </li>
                  ))}
                  <li className="flex justify-center items-center font-bold">
                     <Theme />
                  </li>
               </ul>
            </nav>
         </div>
      </header>
   );
}

export default Navbar;
