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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
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
            age: user.age || "",
            gender: user.gender || "",
            country: user.country || "",
         });
      }
   }, [user]);

   const saveChanges = async () => {
      const save = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/details`,
         details,
         {
            withCredentials: true,
         },
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
                  <div className="space-y-2">
                     <Label htmlFor="firstName" className="ml-3">
                        First Name
                     </Label>
                     <Input
                        id="firstName"
                        placeholder="First Name"
                        type="text"
                        value={details?.firstName}
                        onChange={(e) =>
                           setdetails({ ...details, firstName: e.target.value })
                        }
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="lastName" className="ml-3">
                        Last Name
                     </Label>
                     <Input
                        id="lastName"
                        placeholder="Last Name"
                        type="text"
                        value={details?.lastName}
                        onChange={(e) =>
                           setdetails({ ...details, lastName: e.target.value })
                        }
                     />
                  </div>
               </div>
               <div className="flex gap-2 items-center justify-between">
                  <div className="space-y-2 w-full">
                     <Label htmlFor="age" className="ml-3">
                        Age
                     </Label>
                     <Input
                        id="age"
                        placeholder="Age"
                        type="number"
                        min={1}
                        max={120}
                        value={details?.age}
                        onChange={(e) =>
                           setdetails({ ...details, age: e.target.value })
                        }
                     />
                  </div>
                  <div className="space-y-2 w-full">
                     <Label className="ml-3">Gender</Label>
                     <Select
                        value={details?.gender}
                        onValueChange={(val) =>
                           setdetails({ ...details, gender: val })
                        }
                        className="w-full"
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="male">Male</SelectItem>
                           <SelectItem value="female">Female</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="country" className="ml-3">
                     Country
                  </Label>
                  <Input
                     id="country"
                     placeholder="Country"
                     type="text"
                     value={details?.country}
                     onChange={(e) =>
                        setdetails({ ...details, country: e.target.value })
                     }
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
