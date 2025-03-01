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
import { getToken, setToken } from "./lib/storeToken";

const Privacy = lazy(() => import("./components/etc/Privacy"));
const TermsAndConditions = lazy(() =>
   import("./components/etc/Terms&Conditions")
);
const DeleteAccount = lazy(() => import("./components/etc/DeleteAccount"));
const Profile = lazy(() => import("./components/profile/Profile"));
const Habit = lazy(() => import("./components/Habit/Habit"));
const SteakList = lazy(() => import("./components/Steak/SteakList"));
const AddHabit = lazy(() => import("./components/Habit/AddHabit"));
const Home = lazy(() => import("./components/Home/Home"));
const Chat = lazy(() => import("./components/chat/chat"));
const Navi = lazy(() => import("./components/app/Navigate"));
const Archive = lazy(() => import("./components/Habit/Archive"));

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
            children: [
               {
                  path: "",
                  element: (
                     <Suspense fallback={<Loader />}>
                        <Profile />
                     </Suspense>
                  ),
               },
            ],
         },
         {
            path: "/close-account",
            element: (
               <Suspense fallback={<Loader />}>
                  <DeleteAccount />
               </Suspense>
            ),
         },
         {
            path: "/chat",
            element: (
               <Suspense fallback={<Loader />}>
                  <Chat />
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
            path: "/terms-and-conditions",
            element: (
               <Suspense fallback={<Loader />}>
                  <TermsAndConditions />
               </Suspense>
            ),
         },
         {
            path: "/habit-archive",
            element: (
               <Suspense fallback={<Loader />}>
                  <Archive />
               </Suspense>
            ),
         },
      ],
   },
]);

export default function App() {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);

   const LoadHabitList = async () => {
      let hlist = await getToken("habitList");
      if (hlist) {
         hlist = JSON.parse(hlist);
         dispatch(addListHabits(hlist));
      }
      let lastsync = await getToken("lastsyncHL");
      lastsync = 86400000 + lastsync;
      if (new Date().getTime() > lastsync) {
         const habitreq = await axios.get(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            {
               withCredentials: true,
            }
         );
         const { data: hData } = habitreq?.data;
         if (hData?.length > 0) {
            setToken("lastsyncHL", new Date().getTime());
            dispatch(addListHabits(hData));
         }
      }
   };
   const LoadSteakList = async () => {
      let slist = await getToken("streakList");
      if (slist) {
         slist = JSON.parse(slist);
         let keys = Object.keys(slist);
         for (let sl of keys) {
            let ids = Object.keys(slist[sl]);
            for (let i = 0; i < ids.length; i++) {
               dispatch(addSteak(slist[sl][ids[i]]));
            }
         }
      }
      let lastsync = await getToken("lastsyncSL");
      lastsync = 86400000 + lastsync;
      if (new Date().getTime() > lastsync) {
         const steakList = await axios.post(
            `${conf.BACKEND_URL}/api/v1/steak/streak-list`,
            { month: new Date().getMonth(), year: new Date().getFullYear() },
            {
               withCredentials: true,
            }
         );
         const { data: sData } = steakList?.data;
         if (sData?.length > 0) {
            setToken("lastsyncSL", new Date().getTime());
            for (let i = 0; i < sData.length; i++) {
               dispatch(addSteak(sData[i]));
            }
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
      return storeData;
   };

   const asyncTasks = async () => {
      const theme = await getTheme("theme");
      dispatch(setTheme(theme));
      const loggedIn = await checkUser();
      if (loggedIn) {
         LoadHabitList();
         LoadSteakList();
      }
   };

   useEffect(() => {
      asyncTasks();
   }, []);
   return loading ? (
      <Loader />
   ) : (
      <RouterProvider router={router}>
         <Suspense fallback={null}>
            <Navi />
         </Suspense>
         <Layout />
      </RouterProvider>
   );
}
