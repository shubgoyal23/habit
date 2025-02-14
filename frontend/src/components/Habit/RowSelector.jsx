import React from "react";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { getToken, setToken } from "@/lib/storeToken";

function RowSelector({ table }) {
   const tableVisbility = async (column) => {
      let items = await getToken("tableItems");
      items = JSON.parse(items);
      let isVisible = column.getIsVisible();
      isVisible
         ? (items = items.filter((item) => item !== column.id))
         : items.push(column.id);
      column.toggleVisibility(!isVisible);
      await setToken("tableItems", JSON.stringify(items));
   };
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
                        onCheckedChange={() => {
                           tableVisbility(column);
                        }}
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
