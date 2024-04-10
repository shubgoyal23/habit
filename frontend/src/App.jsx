import { Toaster } from "react-hot-toast";
import Register from "./Register";
import Login from "./Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
   {
      path: "/",
      element: <div>Hello world!</div>,
   },
   {
      path: "/login",
      element: <Login />,
   },
   {
      path: "/register",
      element: <Register />,
   },
]);

export default function App() {
   return (
      <div className="">
         <RouterProvider router={router} />
         <Toaster />
      </div>
   );
}
