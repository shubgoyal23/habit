import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/AuthSlice";
import { useEffect, useState } from "react";
import {
   Login,
   Register,
   Habit,
   AddHabit,
   SteakList,
   Home,
   Logout,
} from "./components/index";
import ErrorPage from "./components/Error/ErrorHandler";
import Loader from "./components/Loading/Loading";
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
   const [loading, setLoading] = useState(true);
   const checkUser = async () => {
      axios
         .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/current`, {
            withCredentials: true,
         })
         .then((data) => {
            dispatch(authlogin(data?.data?.data));
            setLoading(false);
         })
         .catch((err) =>
            axios
               .get(
                  `${
                     import.meta.env.VITE_BACKEND_URL
                  }/api/v1/users/renew-token`,
                  {
                     withCredentials: true,
                  }
               )
               .then((data) => {
                  dispatch(authlogin(data?.data?.data));
                  setLoading(false);
               })
               .catch((err) => setLoading(false))
         );
   };
   useEffect(() => {
      checkUser();
   }, []);
   return loading ? (
      <Loader />
   ) : (
      <div className="">
         <RouterProvider router={router}>
            <Layout />
         </RouterProvider>
      </div>
   );
}
