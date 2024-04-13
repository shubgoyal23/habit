import React from "react";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

function RowSelector({ table }) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
               Columns
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            {table
               .getAllColumns()
               .filter((column) => column.getCanHide())
               .map((column) => {
                  return (
                     <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                           column.toggleVisibility(!!value)
                        }
                     >
                        {column.id}
                     </DropdownMenuCheckboxItem>
                  );
               })}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default RowSelector;
