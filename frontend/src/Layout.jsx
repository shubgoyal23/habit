import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
   return (
      <div>
         <Navbar />
         <Outlet />
         <Toaster />
      </div>
   );
}

export default Layout;
