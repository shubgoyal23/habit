import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function TimeSelector({ setValue, getValues, register, errors }) {
   const [timeEdit, setTimeEdit] = useState(true);
   const [localError, setLocalError] = useState(null);

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
      if (errors.startTime) {
         setLocalError(errors.startTime);
      }
   }, [errors]);
   return (
      <div className="grid grid-cols-3 gap-2 items-center justify-between">
         <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
               id="startTime"
               placeholder="1:00 PM"
               type="time"
               className={localError ? "border-red-500 border-2" : ""}
               {...register("startTime", { required: true })}
               onChange={(e) => {
                  setTimeEdit({
                     type: "startTime",
                     val: e.target.value,
                  });
                  setLocalError(null);
               }}
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
   );
}

export default TimeSelector;
