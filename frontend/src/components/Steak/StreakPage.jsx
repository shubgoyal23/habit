import React from "react";
import { Calendar } from "@/components/ui/calendar";

function StreakPage() {
   return (
      <div>
         <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
         />
      </div>
   );
}

export default StreakPage;
