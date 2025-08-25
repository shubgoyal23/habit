import React from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/ThemeSlice";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { NavLink, useNavigate } from "react-router-dom";
import { Notification } from "./Notification";
import { EditDetails } from "./EditDetails";
import { Support } from "./Support";
import ShareApp from "./share";
import { SyncClearTokens } from "@/lib/storeToken";
import {
   CircleAlert,
   Lock,
   LogOut,
   Monitor,
   Moon,
   RefreshCcw,
   Sun,
} from "lucide-react";

function Profile() {
   const userTheme = useSelector((state) => state.userTheme);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const handeltheme = (e) => {
      dispatch(setTheme(e));
   };

   const syncHandler = () => {
      SyncClearTokens();
      navigate("/");
      window.location.reload();
   };
   return (
      <div className="w-full h-full flex justify-center items-center">
         <Card className="mx-auto w-full max-w-md h-full">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Profile</CardTitle>
               <CardDescription>
                  Manage your profile settings and privacy options from here
               </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-scroll h-full space-y-4">
               <div>
                  <h2 className="ml-3">Account</h2>
                  <div className="space-y-1 p-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                     <EditDetails />
                     <Notification />
                     <NavLink
                        to={"/privacy-policy"}
                        className="flex items-center space-x-2 justify-start gap-2"
                     >
                        <Lock />
                        <span>Privacy</span>
                     </NavLink>
                  </div>
               </div>
               <div>
                  <h2 className="ml-3">Support & About</h2>
                  <div className="space-y-1 p-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                     <Support />
                     <ShareApp />
                     <NavLink
                        to={"/terms-and-conditions"}
                        className="flex items-center space-x-2 justify-start gap-2"
                     >
                        <CircleAlert />
                        <span>Terms & Policies</span>
                     </NavLink>
                  </div>
               </div>

               {/* actions */}
               <div>
                  <h2 className="ml-3">Actions</h2>
                  <div className="space-y-1 p-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                     <div className="flex items-center space-x-2 justify-start gap-2">
                        {userTheme === "dark" ? (
                           <Moon />
                        ) : userTheme === "light" ? (
                           <Sun />
                        ) : (
                           <Monitor />
                        )}
                        <Select onValueChange={handeltheme}>
                           <SelectTrigger
                              className="p-1 border-none outline-none flex-1 bg-primary/10 dark:bg-primary/10"
                              variant="none"
                           >
                              <SelectValue placeholder="Select a Theme" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectLabel>Theme</SelectLabel>
                                 <SelectItem value="system">System</SelectItem>
                                 <SelectItem value="dark">Dark</SelectItem>
                                 <SelectItem value="light">Light</SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div
                        className="flex items-center space-x-2 justify-start gap-2 cursor-pointer"
                        onClick={syncHandler}
                     >
                        <RefreshCcw />
                        <span>Sync Data</span>
                     </div>
                     <div
                        className="flex items-center space-x-2 justify-start gap-2 cursor-pointer"
                        onClick={() => navigate("/logout")}
                     >
                        <LogOut />
                        <span>Logout</span>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default Profile;
