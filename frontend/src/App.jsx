import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/AuthSlice";
import { lazy, Suspense, useEffect, useState } from "react";
import { Login, Register, Logout } from "./components/index";
import ErrorPage from "./components/Error/ErrorHandler";
import Loader from "./components/Loading/Loading";
import { conf } from "./conf/conf";

import { VerifyOtp } from "./components/auth/VerifyOtp";
import { ResetPage } from "./components/auth/Reset";
import { setTheme } from "./store/ThemeSlice";

const Privacy = lazy(() => import("./components/etc/Privacy"));
const DeleteAccount = lazy(() => import("./components/etc/DeleteAccount"));
const Profile = lazy(() => import("./components/profile/Profile"));
const Habit = lazy(() => import("./components/Habit/Habit"));
const SteakList = lazy(() => import("./components/Steak/SteakList"));
const AddHabit = lazy(() => import("./components/Habit/AddHabit"));
const Home = lazy(() => import("./components/Home/Home"));

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: "/",
            element: (
               <Suspense fallback={<Loader />}>
                  <Home />
               </Suspense>
            ),
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
            path: "/habit-list",
            element: (
               <Suspense fallback={<Loader />}>
                  <Habit />
               </Suspense>
            ),
         },
         {
            path: "/habit/:id",
            element: (
               <Suspense fallback={<Loader />}>
                  <AddHabit />
               </Suspense>
            ),
         },
         {
            path: "/steak",
            element: (
               <Suspense fallback={<Loader />}>
                  <SteakList />
               </Suspense>
            ),
         },
         {
            path: "/profile",
            element: (
               <Suspense fallback={<Loader />}>
                  <Profile />
               </Suspense>
            ),
         },
         {
            path: "/privacy-policy",
            element: (
               <Suspense fallback={<Loader />}>
                  <Privacy />
               </Suspense>
            ),
         },
         {
            path: "/close-account",
            element: (
               <Suspense fallback={<Loader />}>
                  <DeleteAccount />
               </Suspense>
            ),
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
      dispatch(setTheme(localStorage.getItem("theme")));
   }, []);
   return loading ? (
      <Loader />
   ) : (
      <RouterProvider router={router}>
         <Layout />
      </RouterProvider>
   );
}
