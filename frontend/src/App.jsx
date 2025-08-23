import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import { useDispatch } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorPage from "./components/Error/ErrorHandler";
import Loader from "./components/Loading/Loading";
import { initThemeAndLogin, fetchAppDataInBackground } from "./lib/initApp";

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
const VerifyOtp = lazy(() => import("./components/auth/VerifyOtp"));
const ResetPage = lazy(() => import("./components/auth/Reset"));

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
            element: (
               <Suspense fallback={<Loader />}>
                  <VerifyOtp />
               </Suspense>
            ),
         },
         {
            path: "/reset",
            element: (
               <Suspense fallback={<Loader />}>
                  <ResetPage />
               </Suspense>
            ),
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

   useEffect(() => {
      initThemeAndLogin(dispatch).then((loggedIn) => {
         if (loggedIn) {
            fetchAppDataInBackground(dispatch); // no need to await
         }
         setLoading(false);
      });
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
