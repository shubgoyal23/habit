import Register from "./Register";
import Login from "./Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/AuthSlice";
import { useEffect } from "react";
const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <h1>Hello world</h1>,
         },
         {
            path: "/login",
            element: <Login />,
         },
         {
            path: "/register",
            element: <Register />,
         },
      ],
   },
]);

export default function App() {
   const dispatch = useDispatch();
   useEffect(() => {
      axios
         .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/current`, {
            withCredentials: true,
         })
         .then((data) => {
            console.log(data);
            dispatch(authlogin(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);
   return (
      <div className="">
         <RouterProvider router={router}>
            <Layout />
         </RouterProvider>
      </div>
   );
}
