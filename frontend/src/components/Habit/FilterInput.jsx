import React from "react";
import { Input } from "../ui/input";

function FilterInput({ table }) {
   return (
      <div className="flex items-center py-4">
         <Input
            placeholder="Search Habit"
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
               table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
         />
      </div>
   );
}

export default FilterInput;
