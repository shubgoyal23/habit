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
import {
   getTheme,
   SetTokenToAxios,
   setTokenToStorageAndAxios,
} from "./lib/apphelper";
import { setTheme } from "./store/ThemeSlice";
import { addListHabits } from "./store/HabitSlice";
import { addSteak } from "./store/StreakSlice";

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

   const LoadDateIntoApp = async () => {
const habitreq = await axios.get(
         `${conf.BACKEND_URL}/api/v1/steak/habit`,
         {
            withCredentials: true,
         }
      );
      const steakList = await axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/streak-list`,
         { month: new Date().getMonth(), year: new Date().getFullYear() },
         {
            withCredentials: true,
         }
      );
      const { data: hData } = habitreq?.data;
      if (hData?.length > 0) {
         dispatch(addListHabits(hData));
      }

      const { data: sData } = steakList?.data;
      if (sData?.length > 0) {
         for (let i = 0; i < sData.length; i++) {
            dispatch(addSteak(sData[i]));
         }
      }
   };
   const checkUser = async () => {
      await SetTokenToAxios();
      let storeData = null;
      await axios
         .get(`${conf.BACKEND_URL}/api/v1/users/current`, {
            withCredentials: true,
         })
         .then((data) => {
            storeData = data?.data?.data;
         })
         .catch((err) => console.log(err));

      if (!storeData) {
         await axios
            .get(`${conf.BACKEND_URL}/api/v1/users/renew-token`, {
               withCredentials: true,
            })
            .then((data) => {
               storeData = data?.data?.data;
            })
            .catch((err) => console.log(err));
      }

      if (!storeData) {
         setLoading(false);
         return;
      }
      dispatch(authlogin(storeData));
      if (storeData?.refreshToken) {
         await setTokenToStorageAndAxios(storeData);
      }
      setLoading(false);
      LoadDateIntoApp();
   };

   useEffect(() => {
      dispatch(setTheme(getTheme("theme")));
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
