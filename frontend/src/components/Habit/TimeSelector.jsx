import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function TimeSelector({ times, setTimes }) {
   const [timeEdit, setTimeEdit] = useState(true);

   useEffect(() => {
      switch (timeEdit?.type) {
         case "startTime":
            times.startTime = timeEdit?.val;
            if (times?.endTime) {
               const start = times?.startTime?.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const end = times?.endTime?.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               if (startDate > endDate) {
                  endDate.setDate(endDate.getDate() + 1);
               }
               const diff = endDate.getTime() - startDate.getTime();
               const dur = Math.round(diff / 60000);
               setTimes({ ...times, duration: dur });
            } else if (times?.duration) {
               const start = times?.startTime?.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const dur = 60000 * times?.duration;
               const end = new Date(startDate.getTime() + dur);
               let h = end.getHours();
               let m = end.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               setTimes({ ...times, endTime: `${h}:${m}` });
            }
            break;
         case "endTime":
            times.endTime = timeEdit?.val;
            if (times?.startTime) {
               const start = times?.startTime?.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const end = times?.endTime?.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               if (startDate > endDate) {
                  endDate.setDate(endDate.getDate() + 1);
               }
               const diff = endDate.getTime() - startDate.getTime();
               const dur = Math.round(diff / 60000);
               // setValue("duration", dur);
               setTimes({ ...times, duration: dur });
            } else if (durr) {
               const end = times?.endTime?.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               const dur = 60000 * times?.duration;
               const start = new Date(endDate.getTime() - dur);
               let h = start.getHours();
               let m = start.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               // setValue("startTime", `${h}:${m}`);
               setTimes({ ...times, startTime: `${h}:${m}` });
            }
            break;
         case "duration":
            times.duration = timeEdit?.val;
            if (times?.startTime) {
               const start = times?.startTime?.split(":");
               const startDate = new Date(2025, 0, 1, start[0], start[1], 0);
               const dur = times?.duration * 60000;
               const end = new Date(startDate.getTime() + dur);
               let h = end.getHours();
               let m = end.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               // setValue("endTime", `${h}:${m}`);
               setTimes({ ...times, endTime: `${h}:${m}` });
            } else if (times?.endTime) {
               const end = times?.endTime?.split(":");
               const endDate = new Date(2025, 0, 1, end[0], end[1], 0);
               const dur = 60000 * times?.duration;
               const start = new Date(endDate.getTime() - dur);
               let h = start.getHours();
               let m = start.getMinutes();
               if (h < 10) {
                  h = "0" + h;
               }
               if (m < 10) {
                  m = "0" + m;
               }
               // setValue("startTime", `${h}:${m}`);
               setTimes({ ...times, startTime: `${h}:${m}` });
            }
            break;
         default:
            break;
      }
      return;
   }, [timeEdit, setTimeEdit]);

   return (
      <div className="grid grid-cols-3 gap-2 items-center justify-between">
         <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
               id="startTime"
               placeholder="1:00 PM"
               type="time"
               className={
                  times?.error?.startTime ? "border-red-500 border-2" : ""
               }
               value={times?.startTime}
               onChange={(e) => {
                  setTimeEdit({
                     type: "startTime",
                     val: e.target.value,
                  });
                  setTimes({ ...times, error: {}, startTime: e.target.value });
               }}
            />
         </div>
         <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
               id="endTime"
               placeholder="1:00 PM"
               type="time"
               value={times?.endTime}
               onChange={(e) => {
                  setTimeEdit({
                     type: "endTime",
                     val: e.target.value,
                  });
                  setTimes({ ...times, error: {}, endTime: e.target.value });
               }}
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
               value={times?.duration}
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
                  setTimes({ ...times, error: {}, duration: e.target.value });
               }}
            />
         </div>
      </div>
   );
}

export default TimeSelector;
