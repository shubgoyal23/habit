import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/AuthSlice";
import { useEffect } from "react";
import {Login, Register, Habit, AddHabit, SteakList, Home, Logout} from "./components/index";
import ErrorPage from "./components/Error/ErrorHandler"
const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "/login",
            element: <Login />,
         },
         {
            path: "/logout",
            element: <Logout />,
         },
         {
            path: "/register",
            element: <Register />,
         },
         {
            path: "/habit",
            element: <Habit />,
         },
         {
            path: "/habit/:id",
            element: <AddHabit />,
         },
         {
            path: "/steak",
            element: <SteakList />,
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
