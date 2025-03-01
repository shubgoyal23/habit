import React from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";
import {
   FaCircleExclamation,
   FaCreditCard,
   FaDesktop,
   FaMoon,
   FaRightFromBracket,
   FaSun,
} from "react-icons/fa6";
import { FaLock, FaSyncAlt } from "react-icons/fa";
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
import { clearTokens } from "@/lib/storeToken";

function Profile() {
   const userTheme = useSelector((state) => state.userTheme);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const handeltheme = (e) => {
      dispatch(setTheme(e));
   };
   return (
      <div className="w-full flex justify-center items-center">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Profile</CardTitle>
               <CardDescription>
                  Manage your profile settings and privacy options from here
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <h2>Account</h2>
                     <div className="space-y-1 p-2 pl-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                        <EditDetails />
                        <Notification />
                        <NavLink
                           to={"/privacy-policy"}
                           className="flex items-center space-x-2 justify-start gap-2"
                        >
                           <FaLock />
                           <span>Privacy</span>
                        </NavLink>
                     </div>
                     <h2 className="mt-2">Support & About</h2>
                     <div className="space-y-1 p-2 pl-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                        <Support />
                        <ShareApp />
                        <NavLink
                           to={"/terms-and-conditions"}
                           className="flex items-center space-x-2 justify-start gap-2"
                        >
                           <FaCircleExclamation />
                           <span>Terms & Policies</span>
                        </NavLink>
                     </div>

                     {/* actions */}
                     <h2 className="mt-2">Actions</h2>
                     <div className="space-y-1 p-2 pl-3 bg-white/10 rounded-lg shadow flex flex-col gap-2">
                        <div className="flex items-center space-x-2 justify-start gap-2">
                           {userTheme === "dark" ? (
                              <FaMoon />
                           ) : userTheme === "light" ? (
                              <FaSun />
                           ) : (
                              <FaDesktop />
                           )}
                           <Select className="p-1" onValueChange={handeltheme}>
                              <SelectTrigger
                                 className="p-1 border-none outline-none"
                                 variant="none"
                              >
                                 <SelectValue placeholder="Select a Theme" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Theme</SelectLabel>
                                    <SelectItem value="system">
                                       System
                                    </SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </div>
                        <div
                           className="flex items-center space-x-2 justify-start gap-2 cursor-pointer"
                           onClick={() => {clearTokens()}}
                        >
                          <FaSyncAlt />
                           <span>Sync Data</span>
                        </div>
                        <div
                           className="flex items-center space-x-2 justify-start gap-2 cursor-pointer"
                           onClick={() => navigate("/logout")}
                        >
                           <FaRightFromBracket />
                           <span>Logout</span>
                        </div>
                     </div>
                  </div>
               </div>
               <CardFooter className="p-0 pt-1 justify-between"></CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}

export default Profile;
