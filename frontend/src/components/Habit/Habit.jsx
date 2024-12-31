import { useEffect, useState } from "react";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addListHabits } from "@/store/HabitSlice";
import MarkSteak from "./MarkSteak";
import Action from "./Action";
import { ChevronsUpDown } from "lucide-react";
import RowSelector from "./RowSelector";
import FilterInput from "./FilterInput";
import { conf } from "@/conf/conf";

const columns = [
   {
      id: "Status",
      header: "Status",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <MarkSteak row={row} />,
   },
   {
      accessorKey: "name",
      header: "Habit",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "startTime",
      header: "Start Time",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "endTime",
      header: "End Yime",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "duration",
      header: "Duration",
      cell: (prop) => {
         const value = prop.getValue()
         if(value >= 60){
            return <p>{`${value/60} hrs`}</p>
         }else{
            return <p>{`${value} mins`}</p>
         }
      },
   },
   {
      accessorKey: "place",
      header: "Place",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "how",
      header: "How",
      enableSorting: false,
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "ifthen",
      header: "If not Done",
      enableSorting: false,
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "point",
      header: "Point",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => <Action row={row} />,
   },
];

function Habit() {
   const habitList = useSelector((state) => state.habit) || [];
   const user = useSelector((state) => state.auth.loggedin);
   const [data, setData] = useState(habitList);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [sorting, setSorting] = useState([]);
   const [columnVisibility, setColumnVisibility] = useState({});
   const [columnFilters, setColumnFilters] = useState([]);
   const table = useReactTable({
      data,
      columns,
      state: {
         sorting,
         columnVisibility,
         columnFilters,
      },
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onColumnFiltersChange: setColumnFilters,
   });

   useEffect(() => {
      if(!user){
         navigate("/login")
      }
      axios
         .get(`${conf.BACKEND_URL}/api/v1/steak/habit`, {
            withCredentials: true,
         })
         .then((data) => {
            dispatch(addListHabits(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);

   useEffect(() => {
      setData(habitList);
   }, [habitList]);

   return (
      <div className="w-full p-2 md:p-6 mt-3">
         <h1 className="text-center text-xl font-semibold my-3 text-blue-500 underline underline-offset-2">
            Habit List
         </h1>
         <div className="flex justify-between items-center">
         <FilterInput table={table}/>
         <RowSelector table={table} />
         </div>
         <Table className="md:p-6 text-center border border-gray-200 rounded-md">
            <TableCaption>
               {habitList.length === 0
                  ? "Add habit to see here"
                  : "A list of your Daily Habits."}
            </TableCaption>
            <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="">
                     {headerGroup.headers.map((header) => {
                        return (
                           <TableHead
                              key={header.id}
                              className={`${
                                 header.column.getCanSort()
                                    ? "cursor-pointer"
                                    : ""
                              } `}
                              onClick={header.column.getToggleSortingHandler()}
                           >
                              <span className="flex justify-center items-center">
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                                 {header.column.getCanSort() && (
                                    <ChevronsUpDown className="h-4 w-4" />
                                 )}
                              </span>
                           </TableHead>
                        );
                     })}
                  </TableRow>
               ))}
            </TableHeader>
            <TableBody>
               {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                     <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                     >
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>
                              {flexRender(
                                 cell.column.columnDef.cell,
                                 cell.getContext()
                              )}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                     >
                        No results.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         <div className="flex justify-center mt-6">
            <Link to={"/habit/new"} className="text-blue-500 underline">
               Add New Habit
            </Link>
         </div>
      </div>
   );
}

export default Habit;
