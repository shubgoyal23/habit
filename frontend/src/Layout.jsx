import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div className="pt-16">
         <Navbar />
         <div className="w-full flex justify-center items-start p-2 lg:my-6">
            <Outlet />
         </div>
         <Toaster />
      </div>
   );
}

export default Layout;
