import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";

function DateSelector({ setValue, getValues, register }) {
   const [startDate, setStartdate] = useState();
   const [endDate, setEnddate] = useState();

   useEffect(() => {
      setValue("startDate", startDate);
      setValue("endDate", endDate);
   }, [startDate, endDate]);
   return (
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
                     disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
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
                     disabled={(date) => date < startDate.setHours(0, 0, 0, 0)}
                     initialFocus
                  />
               </PopoverContent>
            </Popover>
         </div>
      </div>
   );
}

export default DateSelector;
