import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as authlogin } from "./store/AuthSlice";
import { lazy, Suspense, useEffect, useState } from "react";
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
import { AddNote, LoadNotes } from "./store/NoteSlice";

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
const Timmer = lazy(() => import("./components/Timer/Timer"));
const Login = lazy(() => import("./components/auth/Login"));
const Logout = lazy(() => import("./components/auth/Logout"));
const Register = lazy(() => import("./components/auth/Register"));

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
            element: (
               <Suspense fallback={<Loader />}>
                  <Login />
               </Suspense>
            ),
         },
         {
            path: "/logout",
            element: (
               <Suspense fallback={<Loader />}>
                  <Logout />
               </Suspense>
            ),
         },
         {
            path: "/register",
            element: (
               <Suspense fallback={<Loader />}>
                  <Register />
               </Suspense>
            ),
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
         {
            path: "/timer",
            element: (
               <Suspense fallback={<Loader />}>
                  <Timmer />
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
      lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
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
      lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
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

   const LoadNotesForMonth = async () => {
      const notes = await getToken("notes");
      if (notes) {
         const noteslist = JSON.parse(notes);
         if (noteslist) {
            dispatch(LoadNotes(noteslist));
         }
      }
      let lastsync = await getToken("lastsyncNotes");
      lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
      let date = new Date();
      if (date.getTime() > lastsync) {
         let sDate = date.getMonth() + "-" + date.getFullYear();
         const req = axios.post(
            `${conf.BACKEND_URL}/api/v1/notes/list-month`,
            {
               fulldate: sDate,
            },
            {
               withCredentials: true,
            }
         );
         req.then((data) => {
            setToken("lastsyncNotes", new Date().getTime());
            const noteslist = data.data.data;
            if (noteslist.length > 0) {
               for (let i = 0; i < noteslist.length; i++) {
                  let dataitem = noteslist[i];
                  dispatch(
                     AddNote({
                        id: dataitem.habitId,
                        date: dataitem.date,
                        month: sDate,
                        notesData: {
                           _id: dataitem._id,
                           note: dataitem.note,
                        },
                     })
                  );
               }
            }
         }).catch((err) => console.log(err));
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
         LoadNotesForMonth();
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
