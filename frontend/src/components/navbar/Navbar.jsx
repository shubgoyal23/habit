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
      <header className="w-full px-6 h-16 bg-background/50 backdrop-blur-lg flex justify-between items-center py-2 shadow-top-lg z-50 rounded-t-xl max-w-3xl mx-auto">
         <div className={`flex-1 items-center w-full`}>
            <nav className="w-full">
               <ul
                  className={`flex items-center ${
                     loggedin ? "justify-between" : "justify-center gap-4"
                  } w-full text-xs text-gray-700 dark:text-gray-200`}
               >
                  {menu.map((item) => (
                     <li key={item.title}>
                        <NavLink
                           className={({ isActive }) =>
                              `${
                                 isActive ? "text-primary" : ""
                              } flex flex-col items-center justify-center text-center gap-0.5 transition-all duration-500`
                           }
                           to={item.to}
                        >
                           {item.icon}
                           {item.title}
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
