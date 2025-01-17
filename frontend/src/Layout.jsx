import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div className="text-black dark:text-white bg-gray-50 dark:bg-gray-950 w-full h-[100svh] overflow-hidden flex flex-col-reverse md:flex-col">
         <div className="w-full h-16">
            <Navbar />
         </div>
         <div className="w-full flex-1 p-2 overflow-y-scroll lg:p-6">
            <Outlet />
         </div>
         {/* <div className="h-6 w-full"></div> */}
         <Toaster />
      </div>
   );
}

export default Layout;
