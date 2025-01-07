import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div className="text-black dark:text-white pt-16 w-full h-[100svh]">
         <Navbar />
         <div className="w-full flex justify-center items-center p-2 lg:my-6">
            <Outlet />
         </div>
         <Toaster />
      </div>
   );
}

export default Layout;
