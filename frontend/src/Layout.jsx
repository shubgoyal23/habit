import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div
         className={`text-foreground bg-background w-full h-[100svh] overflow-hidden flex flex-col-reverse pb-4`}
      >
         <div className="w-full h-16">
            <Navbar />
         </div>
         <div className="w-full flex-1 p-1 overflow-y-scroll">
            <Outlet />
         </div>
         <Toaster />
      </div>
   );
}

export default Layout;
