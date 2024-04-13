import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div className="pt-16">
         <Navbar />
         <Outlet />
         <Toaster />
      </div>
   );
}

export default Layout;
