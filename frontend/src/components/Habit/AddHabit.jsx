import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
   CardTitle,
   CardDescription,
   CardHeader,
   CardContent,
   Card,
   CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addHabit, editHabit } from "@/store/HabitSlice";
import { conf } from "@/conf/conf";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "../ui/collapsible";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { Checkbox } from "../ui/checkbox";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { AiOutlineStop } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";

export default function AddHabit() {
   const user = useSelector((state) => state.auth.loggedin);
   let { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const userData = useSelector((state) => state.habit) || [];
   const { register, handleSubmit, setValue, getValues } = useForm();
   const [timeEdit, setTimeEdit] = useState(null);
   const [startDate, setStartdate] = useState(new Date());
   const [endDate, setEnddate] = useState(new Date());
   const [isOpen, setIsOpen] = useState(false);
   const [repeatisOpen, setRepeatIsOpen] = useState(false);
   const [notify, setNotify] = useState(true);
   const [repeat, setRepeat] = useState([0, 1, 2, 3, 4, 5, 6]);
   const [type, setType] = useState("regular");
   const days = ["S", "M", "T", "W", "T", "F", "S"];

   useEffect(() => {
      const sTime = getValues("startTime");
      const eTime = getValues("endTime");
      const durr = getValues("duration");
      switch (timeEdit?.type) {
         case "startTime":
            if (eTime) {
               const start = timeEdit?.val?.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const end = eTime.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               if (startDate > endDate) {
                  endDate.setDate(endDate.getDate() + 1);
               }
               const diff = endDate.getTime() - startDate.getTime();
               const dur = Math.round(diff / 60000);
               setValue("duration", dur);
            } else if (durr) {
               const start = sTime.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const dur = 60000 * durr;
               const end = new Date(startDate.getTime() + dur);
               let h = end.getHours();
               let m = end.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               setValue("endTime", `${h}:${m}`);
            }
            break;
         case "endTime":
            if (sTime) {
               const start = sTime.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const end = timeEdit?.val?.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               if (startDate > endDate) {
                  endDate.setDate(endDate.getDate() + 1);
               }
               const diff = endDate.getTime() - startDate.getTime();
               const dur = Math.round(diff / 60000);
               setValue("duration", dur);
            } else if (durr) {
               const end = eTime.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               const dur = 60000 * durr;
               const start = new Date(endDate.getTime() - dur);
               let h = start.getHours();
               let m = start.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               setValue("startTime", `${h}:${m}`);
            }
            break;
         case "duration":
            if (sTime) {
               const start = sTime.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const dur = timeEdit?.val * 60000;
               const end = new Date(startDate.getTime() + dur);
               let h = end.getHours();
               let m = end.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               setValue("endTime", `${h}:${m}`);
            } else if (eTime) {
               const end = eTime.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               const dur = 60000 * durr;
               const start = new Date(endDate.getTime() - dur);
               let h = start.getHours();
               let m = start.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               setValue("startTime", `${h}:${m}`);
            }
            break;
         default:
            break;
      }
      return;
   }, [timeEdit]);

   useEffect(() => {
      if (id && id !== "new") {
         const data = userData.find((item) => item._id === id);
         if (data) {
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("startDate", data.startDate); // can be set from current time or start date
            setValue("endDate", data.endDate); // cant we less then start date
            setValue("frequency", data.startTime); // daily, weekly, monthly, yearly, few times a day, few times a week, few times a month
            setValue("notify", data.notify);
            setValue("startTime", data.startTime); // can be set any time
            setValue("endTime", data.endTime); // cannot be less then start time
            setValue("duration", data.time);
            setValue("place", data.place);
            setValue("how", data.how);
            setValue("ifthen", data.ifthen);
            setValue("point", data.point); // 1 to 10 , also called priority
            setValue("type", data.type); // TODO, NavigateHabit, PositiveHabit
         }
      }
   }, [userData]);

   useEffect(() => {
      if (!user) {
         navigate("/login");
      }
   }, []);

   const onSubmit = (data) => {
      if (id === "new") {
         data.notify = notify;
         const addHAbit = axios.post(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            data,
            { withCredentials: true }
         );

         toast.promise(addHAbit, {
            loading: "Loading",
            success: "Habit added successfull",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         addHAbit
            .then((data) => {
               dispatch(addHabit(data.data.data));
               navigate(`/habit`);
            })
            .catch((err) => console.log(err));
      } else {
         const addHAbit = axios.patch(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            { id: id, ...data },
            { withCredentials: true }
         );

         toast.promise(addHAbit, {
            loading: "Loading",
            success: "Habit Edited successfull",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         addHAbit
            .then((data) => {
               dispatch(editHabit(data.data.data));
               navigate("/habit");
            })
            .catch((err) => console.log(err));
      }
   };

   return (
      <div className="w-full flex justify-center items-start">
         <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">
                  {id === "new" ? "Create Habit" : "Edit Habit"}
               </CardTitle>
               <CardDescription>
                  Enter Full details to get most out of this App
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {/* habit name */}
                  <div className="">
                     <Label htmlFor="name">Habit Name</Label>
                     <Input
                        id="name"
                        placeholder="Read Book"
                        required
                        type="text"
                        {...register("name")}
                     />
                  </div>
                  {/* start date and end date */}
                  <div className="grid grid-cols-2 gap-2 items-center justify-between">
                     <div>
                        <Label htmlFor="startTime">Start Date</Label>
                        <Popover>
                           <PopoverTrigger asChild>
                              <Button
                                 variant={"outline"}
                                 className="w-full pl-3 text-left font-normal"
                              >
                                 {startDate ? (
                                    startDate.toLocaleDateString()
                                 ) : (
                                    <span>Pick a Start</span>
                                 )}
                                 <CalendarIcon className="h-4 w-4 ml-1 first-letter:opacity-50" />
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                 mode="single"
                                 selected={startDate}
                                 onSelect={(e) => {
                                    setStartdate(e);
                                    setEnddate(null);
                                 }}
                                 disabled={(date) =>
                                    date < new Date().setHours(0, 0, 0, 0)
                                 }
                                 initialFocus
                              />
                           </PopoverContent>
                        </Popover>
                     </div>
                     <div>
                        <Label htmlFor="startTime">End Date</Label>
                        <Popover>
                           <PopoverTrigger asChild>
                              <Button
                                 variant={"outline"}
                                 className="w-full pl-3 text-left font-normal"
                              >
                                 {endDate ? (
                                    endDate.toLocaleDateString()
                                 ) : (
                                    <span>Pick a End</span>
                                 )}
                                 <CalendarIcon className="h-4 w-4 ml-1 first-letter:opacity-50" />
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                 mode="single"
                                 selected={startDate}
                                 onSelect={(e) => setEnddate(e)}
                                 disabled={(date) =>
                                    date < startDate.setHours(0, 0, 0, 0)
                                 }
                                 initialFocus
                              />
                           </PopoverContent>
                        </Popover>
                     </div>
                  </div>
                  {/* start time, end time, duration */}
                  <div className="grid grid-cols-3 gap-2 items-center justify-between">
                     <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                           id="startTime"
                           placeholder="1:00 PM"
                           type="time"
                           {...register("startTime", { required: true })}
                           onChange={(e) =>
                              setTimeEdit({
                                 type: "startTime",
                                 val: e.target.value,
                              })
                           }
                        />
                     </div>
                     <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                           id="endTime"
                           placeholder="1:00 PM"
                           type="time"
                           {...register("endTime")}
                           onChange={(e) =>
                              setTimeEdit({
                                 type: "endTime",
                                 val: e.target.value,
                              })
                           }
                        />
                     </div>
                     <div>
                        <Label htmlFor="time">Duration</Label>
                        <Input
                           id="time"
                           placeholder="60 min"
                           type="number"
                           min="0"
                           max="1440"
                           {...register("duration")}
                           onChange={(e) => {
                              let num = Number(e.target.value);
                              if (num > 1440) {
                                 num = 1440;
                              }
                              if (num < 0) {
                                 num = 0;
                              }
                              e.target.value = num;
                              setTimeEdit({
                                 type: "duration",
                                 val: e.target.value,
                              });
                           }}
                        />
                     </div>
                  </div>

                  {/* habit type */}
                  <div>
                     <Label htmlFor="type">Habit Type</Label>
                     <div className="grid grid-cols-3 gap-2">
                        <span
                           className={`${
                              type === "regular"
                                 ? "bg-violet-800"
                                 : "bg-gray-500"
                           } p-1 rounded-md cursor-pointer flex flex-col justify-center items-center text-xs`}
                           onClick={() => setType("regular")}
                        >
                           <HiArrowPathRoundedSquare className="h-6 w-6" />
                           Regular
                        </span>
                        <span
                           className={`${
                              type === "negative"
                                 ? "bg-violet-800"
                                 : "bg-gray-500"
                           } p-1 rounded-md  cursor-pointer flex flex-col justify-center items-center text-xs`}
                           onClick={() => setType("negative")}
                        >
                           <AiOutlineStop className="h-6 w-6" />
                           Negative
                        </span>
                        <span
                           className={`${
                              type === "todo" ? "bg-violet-800" : "bg-gray-500"
                           } p-1 rounded-md  cursor-pointer flex flex-col justify-center items-center text-xs`}
                           onClick={() => setType("todo")}
                        >
                           <TiTick className="h-6 w-6" />
                           one time Todo
                        </span>
                     </div>
                  </div>

                  {/* repeat */}
                  <Collapsible
                     open={repeatisOpen}
                     onOpenChange={setRepeatIsOpen}
                     className=""
                  >
                     <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                           <Button
                              variant="outline"
                              className="w-full flex justify-between hover:bg-none mb-2"
                           >
                              <span>Repeat</span>
                              <span className="flex justify-center items-center gap-1">
                                 Everyday
                                 <IoIosArrowForward className="h-3 w-3" />
                              </span>
                           </Button>
                        </CollapsibleTrigger>
                     </div>
                     <CollapsibleContent className="space-y-2 mt-2">
                        <div className="">
                           <Label htmlFor="description">
                              Specific Days in Week
                           </Label>
                           <div className="grid grid-cols-7 gap-1 pt-1">
                              {days.map((day, index) => (
                                 <span
                                    key={index}
                                    className={`${
                                       repeat.includes(index)
                                          ? "bg-violet-800"
                                          : "bg-gray-500"
                                    } p-1 rounded-md cursor-pointer flex flex-col font-bold justify-center items-center text-sm`}
                                    onClick={() => {
                                       if (repeat.includes(index)) {
                                          if (repeat.length === 1) {
                                             return;
                                          }
                                          setRepeat(
                                             repeat.filter((d) => d !== index)
                                          );
                                       } else {
                                          setRepeat([...repeat, index]);
                                       }
                                    }}
                                 >
                                    {day}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </CollapsibleContent>
                  </Collapsible>

                  {/* optional fields */}
                  <Collapsible
                     open={isOpen}
                     onOpenChange={setIsOpen}
                     className=""
                  >
                     <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                           <Button
                              variant="none"
                              className="w-full flex justify-between p-0 hover:bg-none mb-2"
                           >
                              {isOpen ? (
                                 <>
                                    <span>Hide Additional Settings</span>
                                    <FaChevronUp className="h-3 w-3" />
                                    <span className="sr-only">Toggle</span>
                                 </>
                              ) : (
                                 <>
                                    <span>Additional Settings</span>
                                    <FaChevronDown className="h-3 w-3" />
                                    <span className="sr-only">Toggle</span>
                                 </>
                              )}
                           </Button>
                        </CollapsibleTrigger>
                     </div>
                     <CollapsibleContent className="space-y-2 mt-2">
                        <div className="">
                           <Label htmlFor="description">Description</Label>
                           <Textarea
                              id="description"
                              placeholder="Read Book Daily for 15 min in Morning"
                              type="textarea"
                              {...register("description")}
                           />
                        </div>

                        <div className="flex gap-2 items-center justify-between">
                           <div>
                              <Label htmlFor="place">Place</Label>
                              <Input
                                 id="place"
                                 placeholder="Bed Room"
                                 type="text"
                                 {...register("place")}
                              />
                           </div>
                           <div>
                              <Label htmlFor="point">Importance</Label>
                              <Input
                                 id="point"
                                 placeholder="2"
                                 type="number"
                                 {...register("point")}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="how">How you will do it</Label>
                           <Input
                              id="how"
                              placeholder="Morning just befor Tea/Coffee"
                              type="text"
                              {...register("how")}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="ifthen">If not done then?</Label>
                           <Input
                              id="ifthen"
                              type="text"
                              placeholder="if not complete then 30 min extra after lunch"
                              {...register("ifthen")}
                           />
                        </div>
                     </CollapsibleContent>
                  </Collapsible>

                  <div className="flex items-center justify-start">
                     <Checkbox
                        id="notify"
                        checked={notify}
                        onClick={() => {
                           setNotify((prev) => !prev);
                        }}
                     />
                     <Label htmlFor="notify" className="ml-2">
                        Send reminder to do the task
                     </Label>
                  </div>
                  <Button
                     className="w-full bg-violet-800 text-white text-bold hover:bg-violet-900 shadow-md dark:shadow-gray-800 shadow-gray-300"
                     type="submit"
                  >
                     {id === "new" ? "Create Habit" : "Edit Habit"}
                  </Button>
               </form>
               <CardFooter className="p-3 justify-center">
                  Return Back to Habit Page
                  <Link className="text-blue-500 ml-1" to={"/habit"}>
                     Click Here
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
