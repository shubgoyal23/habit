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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CircleHelp } from "lucide-react";

export function Support() {
   const [topic, setTopic] = useState("help");
   const [desc, setdesc] = useState("");

   const saveChanges = async () => {
      let data = { topic, desc };
      const save = axios.post(
         `${conf.BACKEND_URL}/api/v1/users/feedback`,
         data,
         {
            withCredentials: true,
         }
      );
      toast.promise(save, {
         loading: "Sending...",
         success: "successfully",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      save.then(() => {
         setdesc("");
      });
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <div className="flex items-center space-x-2 justify-start gap-2 cursor-pointer">
               <CircleHelp />
               <span>Help & Feedback</span>
            </div>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Help & Feedback</DialogTitle>
               <DialogDescription>
                  Choose a topic to quickly find the assistance you need.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="w-full">
                  <Select
                     className="w-full"
                     value={topic}
                     onValueChange={(e) => {
                        setTopic(e);
                     }}
                  >
                     <SelectTrigger className="">
                        <SelectValue placeholder="Select a Topic" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectGroup>
                           <SelectItem value="help">
                              Issue troubleshooting
                           </SelectItem>
                           <SelectItem value="feature">
                              Feature request
                           </SelectItem>
                           <SelectItem value="feedback">
                              Share Feedback
                           </SelectItem>
                           <SelectItem value="other">other</SelectItem>
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>
               <div className="">
                  <div>
                     <Label htmlFor="desc">
                        {topic == "help"
                           ? "Describe the issue you are facing."
                           : topic == "feature"
                           ? "Describe the Feature You want to included in next version."
                           : topic == "feedback"
                           ? "We Love to Here Your Feedback"
                           : "Tell us whats in your mind."}
                     </Label>
                     <Textarea
                        className="mt-1 h-40"
                        type="text"
                        value={desc}
                        onChange={(e) => setdesc(e.target.value)}
                     />
                  </div>
               </div>
            </div>
            <DialogFooter>
               <Button type="submit" onClick={saveChanges}>
                  Send
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
