import React from "react";
import { Link } from "react-router-dom";
function Home() {
   return (
      <div>
         <div className="flex justify-center items-center mt-8">
            <span
               className="lg:text-8xl md:text-6xl text-5xl font-bold bg-gradient-to-r from-violet-500 via-pink-500 to-indigo-400 text-transparent bg-clip-text"
            >
               Habit Tracker
            </span>
         </div>
         <div className="flex justify-center items-center mt-8">
            <span
               className="lg:text-2xl md:text-xl text-xl font-bold text-center bg-gradient-to-r from-red-600 via-yellow-500 to-pink-600 text-transparent bg-clip-text"
            >
               Record and Track All of Your desired Habits and see changes in 30 days
            </span>
         </div>
      </div>
   );
}

export default Home;
