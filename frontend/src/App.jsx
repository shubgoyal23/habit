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
import { conf } from "./conf/conf";

import Privacy from "./components/etc/Privacy";
import DeleteAccount from "./components/etc/DeleteAccount";
import { VerifyOtp } from "./components/auth/VerifyOtp";
import { ResetPage } from "./components/auth/Reset";

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
            path: "/verify",
            element: <VerifyOtp />,
         },
         {
            path: "/reset",
            element: <ResetPage />,
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
         {
            path: "/privacy-policy",
            element: <Privacy />,
         },
         {
            path: "/close-account",
            element: <DeleteAccount />,
         },
      ],
   },
]);

export default function App() {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);
   const checkUser = async () => {
      axios
         .get(`${conf.BACKEND_URL}/api/v1/users/current`, {
            withCredentials: true,
            headers: {
               accessToken: localStorage.getItem("accessToken"),
            },
         })
         .then((data) => {
            dispatch(authlogin(data?.data?.data));
            setLoading(false);
         })
         .catch((err) =>
            axios
               .get(`${conf.BACKEND_URL}/api/v1/users/renew-token`, {
                  withCredentials: true,
                  headers: {
                     refreshToken: localStorage.getItem("refreshToken"),
                  },
               })
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
      <RouterProvider router={router}>
         <Layout />
      </RouterProvider>
   );
}
