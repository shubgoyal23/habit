import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { cn } from "@/lib/utils";
import { MdClear } from "react-icons/md";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "../ui/select";

function Repeat({ getValues, setValue }) {
   const [repeatisOpen, setRepeatIsOpen] = useState(false);
   const [repeatMode, setRepeatMode] = useState("days");
   const [repeat, setRepeat] = useState([0, 1, 2, 3, 4, 5, 6]);
   const days = ["S", "M", "T", "W", "T", "F", "S"];
   const [dates, setDates] = useState([]);
   const [hr, setHr] = useState(null);
   const startDate = getValues("startDate") || new Date();
   const handleSelect = (selectedDates) => {
      setDates(selectedDates);
   };
   useEffect(() => {
      if (repeatMode == "days") {
         setValue("repeat", repeat);
      } else if (repeatMode == "dates") {
         setValue("repeat", dates);
      } else if (repeatMode == "hours") {
         setValue("repeat", [hr]);
      }
      setValue("repeatMode", repeatMode);
   }, [repeatMode, repeat, dates, hr]);

   return (
      <Collapsible open={repeatisOpen} onOpenChange={setRepeatIsOpen}>
         <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
               <Button
                  variant="outline"
                  className="w-full flex justify-between hover:bg-none"
               >
                  <span>Repeat</span>
                  <span className="flex justify-center items-center gap-1">
                     {repeatMode == "days" &&
                        (repeat.length == 7 ? "EveryDay" : "Some Days in week")}
                     {repeatMode == "dates" && "Some Days in month"}
                     {repeatMode == "hours" && hr && `every ${hr} minutes`}
                     <IoIosArrowForward className="h-3 w-3" />
                  </span>
               </Button>
            </CollapsibleTrigger>
         </div>
         <CollapsibleContent className="p-2 py-3 border border-t-0 border-gray-700 rounded-md">
            <div className="mb-2">
               <Label
                  htmlFor=""
                  className="flex items-center justify-between text-base"
               >
                  Specific Days in Week{" "}
                  <Checkbox
                     className="h-4 w-4"
                     checked={repeatMode == "days"}
                     onClick={(e) => setRepeatMode("days")}
                  />
               </Label>
               {repeatMode == "days" ? (
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
                                 setRepeat(repeat.filter((d) => d !== index));
                              } else {
                                 setRepeat([...repeat, index]);
                              }
                           }}
                        >
                           {day}
                        </span>
                     ))}
                  </div>
               ) : (
                  ""
               )}
            </div>
            <div className="">
               <Label
                  htmlFor=""
                  className="flex items-center justify-between text-base"
               >
                  Specific Dates{" "}
                  <Checkbox
                     className="h-4 w-4"
                     checked={repeatMode == "dates"}
                     onClick={() => setRepeatMode("dates")}
                  />
               </Label>
               {repeatMode == "dates" ? (
                  <div className="">
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant={"outline"}
                              className={cn(
                                 "w-full hover:bg-none mt-2",
                                 dates.length === 0 && "text-muted-foreground"
                              )}
                           >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick dates</span>
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent
                           className="w-auto p-0 mt-2"
                           align="center"
                        >
                           <Calendar
                              mode="multiple"
                              disabled={(date) =>
                                 date < startDate.setHours(0, 0, 0, 0)
                              }
                              selected={dates}
                              onSelect={handleSelect}
                              initialFocus
                           />
                           {dates.length > 0 ? (
                              <span
                                 className="w-full flex items-center justify-center gap-2 py-1 text-xs cursor-pointer"
                                 onClick={() => setDates([])}
                              >
                                 Clear All Dates
                                 <MdClear className="h-4 w-4 cursor-pointer" />
                              </span>
                           ) : (
                              ""
                           )}
                        </PopoverContent>
                     </Popover>
                  </div>
               ) : (
                  ""
               )}
            </div>
            <div className="mt-2">
               <Label
                  htmlFor=""
                  className="flex items-center justify-between text-base"
               >
                  After Time Interval in a day
                  <Checkbox
                     className="h-4 w-4"
                     checked={repeatMode == "hours"}
                     onClick={() => setRepeatMode("hours")}
                  />
               </Label>
               {repeatMode == "hours" ? (
                  <div className="">
                     {!getValues("startTime") && !getValues("endTime") ? (
                        <span className="text-xs text-red-500">
                           Please Select Start and End Time First
                        </span>
                     ) : (
                        <Select
                           value={hr}
                           onValueChange={(e) => {
                              setHr(e);
                           }}
                        >
                           <SelectTrigger className="w-full mt-2">
                              <SelectValue placeholder="Select a Interval" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup className="w-full">
                                 <SelectLabel>After Time Interval</SelectLabel>
                                 <SelectItem value="15">
                                    Every 15 minutes
                                 </SelectItem>
                                 <SelectItem value="30">
                                    Every 30 minutes
                                 </SelectItem>
                                 <SelectItem value="60">
                                    Every 1 hour
                                 </SelectItem>
                                 <SelectItem value="90">
                                    Every 1.5 hours
                                 </SelectItem>
                                 <SelectItem value="120">
                                    Every 2 hours
                                 </SelectItem>
                                 <SelectItem value="150">
                                    Every 2.5 hours
                                 </SelectItem>
                                 <SelectItem value="180">
                                    Every 5 hours
                                 </SelectItem>
                                 <SelectItem value="240">
                                    Every 4 hours
                                 </SelectItem>
                                 <SelectItem value="480">
                                    Every 8 hours
                                 </SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     )}
                  </div>
               ) : (
                  ""
               )}
            </div>
         </CollapsibleContent>
      </Collapsible>
   );
}

export default Repeat;
