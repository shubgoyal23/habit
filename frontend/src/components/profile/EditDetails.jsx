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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import { User } from "lucide-react";

export function EditDetails() {
   const [details, setdetails] = useState({});
   const user = useSelector((state) => state.auth.userDate);

   useEffect(() => {
      if (user) {
         setdetails({
            firstName: user.firstName,
            lastName: user.lastName,
         });
      }
   }, [user]);

   const saveChanges = async () => {
      const save = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/details`,
         details,
         {
            withCredentials: true,
         }
      );
      toast.promise(save, {
         loading: "Saving changes...",
         success: "Profile updated successfully",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <div className="flex items-center space-x-2 justify-start gap-2 cursor-pointer">
               <User /> <span>Edit Profile</span>
            </div>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Edit Profile Details</DialogTitle>
               <DialogDescription>
                  Make changes to your Profile here. Click save when you're
                  done.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="flex gap-2 items-center justify-between">
                  <div>
                     <Label htmlFor="firstName">First Name</Label>
                     <Input
                        id="firstName"
                        placeholder="first Name"
                        type="text"
                        value={details?.firstName}
                        onChange={(e) =>
                           setdetails({ ...details, firstName: e.target.value })
                        }
                     />
                  </div>
                  <div>
                     <Label htmlFor="lastName">Last Name</Label>
                     <Input
                        id="lastName"
                        placeholder="last Name"
                        type="text"
                        value={details?.lastName}
                        onChange={(e) =>
                           setdetails({ ...details, lastName: e.target.value })
                        }
                     />
                  </div>
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
