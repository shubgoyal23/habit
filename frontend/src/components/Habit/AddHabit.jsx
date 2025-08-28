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
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "../ui/collapsible";
import { Checkbox } from "../ui/checkbox";
import Repeat from "./Repeat";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import { EpochToDate, EpochToTime } from "@/lib/helpers";
import { deleteArchive } from "@/store/ArchiveSlice";
import { Ban, Check, ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";

export default function AddHabit() {
   const user = useSelector((state) => state.auth.loggedin);
   let { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const userData = useSelector((state) => state.habit) || [];
   const userDataArchive = useSelector((state) => state.archive) || [];
   const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
   } = useForm();

   const [isOpen, setIsOpen] = useState(false);
   const [notify, setNotify] = useState(true);
   const [type, setType] = useState("regular");
   const [dates, setDates] = useState({});
   const [times, setTimes] = useState({});
   const [repeat, setRepeat] = useState({});
   const [isArchived, setIsArchived] = useState(false);

   const getHabitDate = async () => {
      if (id && id !== "new") {
         let data = userData?.find((item) => item._id === id);
         if (!data) {
            data = userDataArchive?.find((item) => item._id === id);
            setIsArchived(true);
         }
         if (data) {
            setDates({
               startDate: EpochToDate(data.startDate * 1000),
               endDate: EpochToDate(data.endDate * 1000),
            });
            setTimes({
               startTime: EpochToTime(data.startTime * 1000),
               endTime: EpochToTime(data.endTime * 1000),
               duration: data.duration,
            });
            setRepeat(data.frequency);
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("notify", data.notify);
            setValue("duration", data.duration);
            setValue("place", data.place);
            setValue("how", data.how);
            setValue("ifthen", data.ifthen);
            setValue("point", data.point); // 1 to 10 , also called priority
            setType(data.habitType);
         }
      }
   };

   useEffect(() => {
      getHabitDate();
   }, [userData]);

   useEffect(() => {
      if (!user) {
         navigate("/login");
      }
   }, []);

   const onSubmit = (data) => {
      if (!times?.startTime && type != "negative") {
         setTimes({
            ...times,
            error: { startTime: true },
         });
         toast.error("Please select start Time");
         return;
      }
      data.notify = notify;
      data.habitType = type;
      data.repeat = { name: data.repeatMode, value: data.repeat };
      data.startDate = dates.startDate;
      data.endDate = dates.endDate;
      data.startTime = times.startTime;
      data.endTime = times.endTime;
      data.duration = times.duration;
      if (id === "new") {
         data.notify = notify;
         const addHAbit = axios.post(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            data,
            { withCredentials: true },
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
               navigate(`/habit-list`);
            })
            .catch((err) => console.log(err));
      } else {
         const addHAbit = axios.patch(
            `${conf.BACKEND_URL}/api/v1/steak/habit`,
            { id: id, ...data },
            { withCredentials: true },
         );

         toast.promise(addHAbit, {
            loading: "Loading",
            success: "Habit Edited successfull",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         addHAbit
            .then((data) => {
               if (isArchived) {
                  dispatch(deleteArchive(id));
                  dispatch(addHabit(data.data.data));
               } else {
                  dispatch(editHabit(data.data.data));
               }
               navigate("/habit-list");
            })
            .catch((err) => console.log(err));
      }
   };
   return (
      <div className="w-full h-full flex justify-center items-center">
         <Card className="pt-10 md:pt-6 mx-auto max-w-md w-full h-full">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">
                  {id === "new" ? "Create Habit" : "Edit Habit"}
               </CardTitle>
               <CardDescription>
                  Enter Full details to get most out of this App
               </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-scroll h-full">
               <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {/* habit type */}
                  <div>
                     <Label className="mb-2 ml-3" htmlFor="type">
                        Habit Type
                     </Label>
                     <div className="grid grid-cols-3 gap-2">
                        <span
                           className={`${
                              type === "regular"
                                 ? "bg-green-600"
                                 : "bg-secondary opacity-50"
                           } p-1 rounded-md cursor-pointer flex flex-col justify-center items-center text-xs transition-all duration-500`}
                           onClick={() => setType("regular")}
                        >
                           <RefreshCcw className="h-6 w-6" />
                           Regular
                        </span>
                        <span
                           className={`${
                              type === "negative"
                                 ? "bg-red-600"
                                 : "bg-secondary opacity-50"
                           } p-1 rounded-md h-16 cursor-pointer flex flex-col justify-center items-center text-xs transition-all duration-500`}
                           onClick={() => setType("negative")}
                        >
                           <Ban className="h-6 w-6" />
                           Negative
                        </span>
                        <span
                           className={`${
                              type === "todo"
                                 ? "bg-blue-800"
                                 : "bg-secondary opacity-50"
                           } p-1 rounded-md  cursor-pointer flex flex-col justify-center items-center text-xs transition-all duration-500`}
                           onClick={() => setType("todo")}
                        >
                           <Check className="h-6 w-6" />
                           one time Todo
                        </span>
                     </div>
                  </div>
                  {/* habit type description */}
                  <div>
                     <div className="relative bg-chart-4 rounded-md p-2 pl-4">
                        <span
                           className={`absolute -top-[6px] box-border p-2 bg-chart-4 rotate-45 transition-all duration-500 rounded-sm  ${
                              type == "regular"
                                 ? "left-[13%]"
                                 : type == "todo"
                                 ? "left-[83%]"
                                 : "left-[50%] -translate-x-2"
                           }`}
                        ></span>
                        <h2 className="font-bold capitalize">{type}</h2>
                        {type === "regular" && (
                           <p className="text-xs text-gray-700 dark:text-gray-100/70">
                              A habit you follow daily. Mark it regularly as you
                              complete it. Example: Reading a book every day.
                           </p>
                        )}
                        {type === "negative" && (
                           <p className="text-xs text-gray-700 dark:text-gray-100/70">
                              Starts as completed each day. Uncheck it only if
                              you fail. Example: Avoiding smoking or alcohol.
                           </p>
                        )}
                        {type === "todo" && (
                           <p className="text-xs text-gray-700 dark:text-gray-100/70">
                              A reminder for one-time tasks on a specific date.
                              Example: Taking a medical test on Friday.
                           </p>
                        )}
                     </div>
                  </div>
                  {/* habit name */}
                  <div className="space-y-2">
                     <Label className="ml-3" htmlFor="name">
                        Habit Name
                     </Label>
                     <Input
                        id="name"
                        placeholder="Read Book"
                        type="text"
                        className={
                           errors?.name ? "border-red-500 border-2" : ""
                        }
                        {...register("name", { required: true })}
                     />
                  </div>
                  {/* start date and end date */}
                  <DateSelector dates={dates} setDates={setDates} type={type} />
                  {/* start time, end time, duration */}
                  {type !== "negative" && (
                     <TimeSelector times={times} setTimes={setTimes} />
                  )}

                  {/* repeat */}
                  {type == "regular" && (
                     <Repeat
                        timesobj={times}
                        getValues={getValues}
                        setValue={setValue}
                     />
                  )}

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
                                    <ChevronUp className="h-3 w-3" />
                                    <span className="sr-only">Toggle</span>
                                 </>
                              ) : (
                                 <>
                                    <span>Additional Settings</span>
                                    <ChevronDown className="h-3 w-3" />
                                    <span className="sr-only">Toggle</span>
                                 </>
                              )}
                           </Button>
                        </CollapsibleTrigger>
                     </div>
                     <CollapsibleContent className="space-y-2 border border-t-1 rounded-md border-gray-700 p-4">
                        <div className="space-y-2">
                           <Label className="ml-3" htmlFor="description">
                              Description
                           </Label>
                           <Textarea
                              id="description"
                              placeholder="Read Book Daily for 15 min in Morning"
                              type="textarea"
                              {...register("description")}
                           />
                        </div>

                        <div className="flex gap-2 items-center justify-between">
                           <div className="space-y-2">
                              <Label className="ml-3" htmlFor="place">
                                 Place
                              </Label>
                              <Input
                                 id="place"
                                 placeholder="Bed Room"
                                 type="text"
                                 {...register("place")}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="ml-3" htmlFor="point">
                                 Importance
                              </Label>
                              <Input
                                 id="point"
                                 placeholder="2"
                                 type="number"
                                 {...register("point")}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label className="ml-3" htmlFor="how">
                              How you will do it
                           </Label>
                           <Input
                              id="how"
                              placeholder="Morning just befor Tea/Coffee"
                              type="text"
                              {...register("how")}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="ml-3" htmlFor="ifthen">
                              If not done then?
                           </Label>
                           <Input
                              id="ifthen"
                              type="text"
                              placeholder="if not complete then 30 min extra after lunch"
                              {...register("ifthen")}
                           />
                        </div>
                     </CollapsibleContent>
                  </Collapsible>

                  {type !== "negative" && (
                     <div className="flex items-center justify-start ml-3">
                        <Checkbox
                           id="notify"
                           checked={notify}
                           onClick={() => {
                              setNotify((prev) => !prev);
                           }}
                        />
                        <Label className="ml-2" htmlFor="notify">
                           Send reminder to do the task
                        </Label>
                     </div>
                  )}
                  <Button
                     className="w-full"
                     type="submit"
                  >
                     {id === "new" ? "Create Habit" : "Edit Habit"}
                  </Button>
               </form>
               <CardFooter className="p-3 justify-center">
                  Return Back to Habit Page
                  <Link className="text-blue-500 ml-1" to={"/habit-list"}>
                     Click Here
                  </Link>
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}
