import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";

export function Notification() {
   const [rTimes, setRTimes] = useState("22:00");
   const [notify, setNotify] = useState(false);
   const user = useSelector((state) => state.auth.userDate);

   useEffect(() => {
      if (user) {
         setNotify(!!user.notify);
         if (user.notifyTime) {
            let t = new Date(user.notifyTime * 1000);
            let hr = t.getHours();
            let min = t.getMinutes();
            if (hr < 10) hr = "0" + hr;
            if (min < 10) min = "0" + min;
            setRTimes(`${hr}:${min}`);
         }
      }
   }, [user]);

   const saveChanges = async () => {
      let TimeEpoch = Math.ceil(
         new Date(2025, 0, 1, 22, 0, 0, 0, 0).getTime() / 1000
      );
      if (rTimes) {
         let t = rTimes.split(":");
         TimeEpoch = Math.ceil(
            new Date(2025, 0, 1, t[0], t[1], 0, 0, 0).getTime() / 1000
         );
      }
      const save = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/details`,
         { notifyTime: TimeEpoch, notify: notify },
         {
            withCredentials: true,
         }
      );
      toast.promise(save, {
         loading: "Saving changes...",
         success: "Notifications updated successfully",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <div className="flex items-center space-x-2 justify-start gap-2 cursor-pointer">
               <Bell />
               <span>Notifications</span>
            </div>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Edit Notifications</DialogTitle>
               <DialogDescription>
                  Make changes to your Notificaion here. Click save when you're
                  done.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="flex justify-between items-center gap-4">
                  <Label htmlFor="reminderTime" className="">
                     Habit Pending Reminder Time
                  </Label>
                  <Input
                     id="reminderTime"
                     placeholder="1:00 PM"
                     type="time"
                     className="flex-1 max-w-28 text-center flex justify-center items-center"
                     value={rTimes}
                     onChange={(e) => {
                        setRTimes(e.target.value);
                     }}
                  />
               </div>
               <div className="flex items-center justify-between">
                  <Label htmlFor="notify" className="">
                     Habit Pending Notifications
                  </Label>
                  <Checkbox
                     id="notify"
                     className="size-5"
                     checked={notify}
                     onClick={() => {
                        setNotify((prev) => !prev);
                     }}
                  />
               </div>
            </div>
            <DialogFooter>
               <Button type="submit" onClick={saveChanges}>
                  Save changes
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
