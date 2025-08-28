import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
   CircleUser,
   Flame,
   House,
   IdCard,
   LogIn,
   Plus,
   TableOfContents,
} from "lucide-react";

function Navbar() {
   const loggedin = useSelector((state) => state.auth.loggedin);
   const [menu, setMenu] = useState([]);

   useEffect(() => {
      !loggedin
         ? setMenu([
              {
                 title: "Login",
                 to: "/login",
                 icon: <LogIn className="w-6 h-6" />,
              },
              {
                 title: "Register",
                 to: "/register",
                 icon: <IdCard className="w-6 h-6" />,
              },
           ])
         : setMenu([
              { title: "Home", to: "/", icon: <House className="w-6 h-6" /> },
              {
                 title: "Add Habit",
                 to: "/habit/new",
                 icon: <Plus className="w-6 h-6" />,
              },
              {
                 title: "Habits Table",
                 to: "/habit-list",
                 icon: <TableOfContents className="w-6 h-6" />,
              },
              {
                 title: "Streak Table",
                 to: "/steak",
                 icon: <Flame className="w-6 h-6" />,
              },
              {
                 title: "Profile",
                 to: "/profile",
                 icon: <CircleUser className="w-6 h-6" />,
              },
           ]);
   }, [loggedin]);
   return (
      <header className="w-full lg:px-16 px-6 h-16 bg-background/50 backdrop-blur-lg flex justify-between items-center py-2 shadow-top-lg md:shadow-md z-50 rounded-t-xl md:rounded-t-none md:rounded-b-xl">
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
               <ul
                  className={`flex items-center ${
                     loggedin ? "justify-between" : "justify-center gap-4"
                  } sm:justify-evenly md:justify-end md:gap-4 lg:gap-6 w-full text-xs md:text-base text-gray-700 dark:text-gray-200`}
               >
                  {menu.map((item) => (
                     <li key={item.title}>
                        <NavLink
                           className={({ isActive }) =>
                              `${
                                 isActive ? "text-primary" : ""
                              } flex flex-col-reverse md:flex-row items-center justify-center text-center md:gap-1 transition-all duration-500`
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
