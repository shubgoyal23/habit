import React from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";

function DateSelector({ dates, setDates, type }) {
   return (
      <div className="flex gap-2 items-center justify-between">
         <div className="flex-1">
            <Label className="mb-2" htmlFor="startTime">Start Date</Label>
            <Popover>
               <PopoverTrigger asChild>
                  <Button
                     variant={"outline"}
                     className="w-full pl-3 text-left font-normal"
                  >
                     {dates?.startDate ? (
                        dates.startDate.toLocaleDateString()
                     ) : (
                        <span>Pick a Start</span>
                     )}
                     <CalendarIcon className="h-4 w-4 ml-1 first-letter:opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     mode="single"
                     selected={dates?.startDate}
                     onSelect={(e) => {
                        setDates({ startDate: e, endDate: null });
                     }}
                     disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                     initialFocus
                  />
               </PopoverContent>
            </Popover>
         </div>
         {type !== "todo" && (
            <div className="flex-1">
               <Label className="mb-2" htmlFor="startTime">End Date</Label>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                     >
                        {dates?.endDate ? (
                           dates.endDate.toLocaleDateString()
                        ) : (
                           <span>Pick a End</span>
                        )}
                        <CalendarIcon className="h-4 w-4 ml-1 first-letter:opacity-50" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={dates?.endDate}
                        onSelect={(e) => {
                           setDates((prev) => ({ ...prev, endDate: e }));
                        }}
                        disabled={(date) =>
                           date < dates?.startDate?.setHours(0, 0, 0, 0)
                        }
                        initialFocus
                     />
                  </PopoverContent>
               </Popover>
            </div>
         )}
      </div>
   );
}

export default DateSelector;
