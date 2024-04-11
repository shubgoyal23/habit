import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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
            { title: "Habits", to: "/habit" },
            { title: "Add Habit", to: "/habit/new" },
            { title: "Streak Table", to: "/steak" },
            { title: "Logout", to: "/logout" },
         ]);
   }, [loggedin]);
   return (
      <header className="lg:px-16 px-4 h-16 bg-white flex flex-wrap items-center py-2 shadow-md">
         <div className="flex-1 flex justify-between items-center">
            <Link className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text" to={"/"}>
               Habit Tracker
            </Link>
         </div>
         <div
            htmlFor="menu-toggle"
            className="cursor-pointer md:hidden block"
            onClick={() => setMobileNav(prev => !prev)}
         >
            <svg
               className="fill-current text-gray-900"
               xmlns="http://www.w3.org/2000/svg"
               width={20}
               height={20}
               viewBox="0 0 20 20"
            >
               <title>menu</title>
               <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
         </div>
         <div
            className={`hidden md:flex md:items-center md:w-auto w-full`}
         >
            <nav>
               <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                  {menu.map(item => ( <li key={item.title}>
                     <Link
                        className="md:p-4 py-3 px-0 block md:mb-0 mb-2"
                        to={item.to}
                     >
                        {item.title}
                     </Link>
                  </li>) )}
               </ul>
            </nav>
         </div>
         <div
            className={`absolute ${mobileNav? "left-0" : "-left-[800px]"} transition-all duration-300 ease-in top-16 md:hidden bg-white/30 w-screen backdrop-blur-sm flex justify-center pt-3 h-screen`}
         >
            <nav className={``}>
               <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                  {menu.map(item => ( <li key={item.title}>
                     <Link
                        className="md:p-4 py-3 px-0 block font-semibold text-xl text-center mb-2"
                        to={item.to}
                        onClick={() => setMobileNav(prev => !prev)}
                     >
                        {item.title}
                     </Link>
                  </li>) )}
               </ul>
            </nav>
         </div>
      </header>
   );
}

export default Navbar;
