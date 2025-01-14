import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import { FaFire } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";

function Navbar() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const [menu, setMenu] = useState([]);

   useEffect(() => {
      !loggedin
         ? setMenu([
              { title: "Login", to: "/login" },
              { title: "Register", to: "/register" },
           ])
         : setMenu([
              { title: "Home", to: "/", icon: <FaHome className="w-6 h-6" /> },
              {
                 title: "Add Habit",
                 to: "/habit/new",
                 icon: <IoIosAdd className="w-6 h-6" />,
              },
              {
                 title: "Habits Table",
                 to: "/habit-list",
                 icon: <CiViewList className="w-6 h-6" />,
              },
              {
                 title: "Streak Table",
                 to: "/steak",
                 icon: <FaFire className="w-6 h-6" />,
              },
              {
                 title: "Profile",
                 to: "/profile",
                 icon: <RxAvatar className="w-6 h-6" />,
              },
           ]);
   }, [loggedin]);
   return (
      <header className="w-full lg:px-16 px-4 h-14 bg-gray-300/50 dark:bg-gray-900/50 backdrop-blur-lg flex justify-between items-center py-2 shadow-top-lg md:shadow-md z-50 rounded-t-xl md:rounded-t-none md:rounded-b-xl">
         <div className="flex-1 hidden md:flex justify-between items-center">
            <Link
               className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 text-transparent bg-clip-text"
               to={"/"}
            >
               Habit Tracker
            </Link>
         </div>
         <div className={`flex-1 items-center w-full`}>
            <nav className="w-full">
               <ul className="flex items-center justify-evenly w-full text-xs md:text-base text-gray-700 dark:text-gray-200">
                  {menu.map((item) => (
                     <li key={item.title}>
                        <NavLink
                           className={({ isActive }) =>
                              `${
                                 isActive ? "font-bold text-violet-800" : ""
                              } flex flex-col-reverse md:flex-row items-center justify-center md:gap-1`
                           }
                           to={item.to}
                        >
                           {item.title}
                           <span className="md:hidden">{item.icon}</span>
                        </NavLink>
                     </li>
                  ))}
               </ul>
            </nav>
         </div>
      </header>
   );
}

export default Navbar;
