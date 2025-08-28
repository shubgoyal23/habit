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
import RowSelector from "./RowSelector";
import FilterInput from "./FilterInput";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import { EpochToTime } from "@/lib/helpers";
import { getToken, setToken } from "@/lib/storeToken";
import { ChevronsUpDown } from "lucide-react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";

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
      header: "End Time",
      cell: (prop) => <p>{prop.getValue()}</p>,
   },
   {
      accessorKey: "startDate",
      header: "Start Date",
      cell: (prop) => <p>{new Date(prop.getValue()).toDateString()}</p>,
   },
   {
      accessorKey: "endDate",
      header: "End Date",
      cell: (prop) => <p>{new Date(prop.getValue()).toDateString()}</p>,
   },
   {
      accessorKey: "duration",
      header: "Duration",
      cell: (prop) => {
         const value = prop.getValue();
         if (value >= 60) {
            return <p>{`${value / 60} hrs`}</p>;
         } else {
            return <p>{`${value} mins`}</p>;
         }
      },
   },
   {
      accessorKey: "notify",
      header: "Notify",
      cell: (prop) => <p>{prop.getValue() ? "Yes" : "No"}</p>,
   },
   {
      accessorKey: "habitType",
      header: "habit Type",
      cell: (prop) => <p>{prop.getValue()}</p>,
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
      header: "Importance",
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
   const [data, setData] = useState([]);
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

   const TableHeads = async () => {
      let tableItems = await getToken("tableItems");
      if (!tableItems) {
         tableItems = ["name", "startTime", "habitType"];
         await setToken("tableItems", JSON.stringify(tableItems));
      } else {
         tableItems = JSON.parse(tableItems);
      }
      let columns = table.getAllColumns();
      for (let column of columns) {
         let id = column.id;
         if (!tableItems.includes(id)) {
            column.toggleVisibility(false);
         }
      }
   };

   useEffect(() => {
      if (!user) {
         navigate("/login");
      } else {
         TableHeads();
      }
      if (habitList.length > 0) return;
      let request = axios.get(`${conf.BACKEND_URL}/api/v1/steak/habit`, {
         withCredentials: true,
      });
      toast.promise(request, {
         loading: "Loading Habit List",
         success: "successfull",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      request
         .then((data) => {
            setToken("lastsyncHL", new Date().getTime());
            dispatch(addListHabits(data?.data?.data));
         })
         .catch((err) => console.log(err));
   }, []);

   useEffect(() => {
      if (!habitList) {
         return;
      }
      let list = [];
      for (let i = 0; i < habitList.length; i++) {
         let h = { ...habitList[i] };
         if (h.startTime) {
            h.startTime = EpochToTime(h.startTime * 1000);
         }
         if (h.endTime) {
            h.endTime = EpochToTime(h.endTime * 1000);
         }
         if (!h.duration) {
            h.duration = 0;
         }
         if (h.startDate) {
            h.startDate = new Date(h.startDate * 1000);
         }
         if (h.endDate) {
            h.endDate = new Date(h.endDate * 1000);
            if (h.endDate < new Date()) {
               continue;
            }
         }
         list.push(h);
      }
      setData(list);
   }, [habitList]);

   return (
      <div className="w-full h-full flex justify-center items-center">
         <Card className="pt-10 md:pt-0 mx-auto w-full h-full pb-0">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">Habit List</CardTitle>
               <CardDescription>List of All Habits You have</CardDescription>
               <div className="flex justify-between items-center">
                  <FilterInput table={table} />
                  <RowSelector table={table} />
               </div>
            </CardHeader>
            <CardContent className="overflow-y-scroll h-full">
               <Table className="md:p-4 text-center">
                  <TableCaption>
                     {habitList.length === 0
                        ? "Add habit to see here"
                        : "A list of your Daily Habits."}
                  </TableCaption>
                  <TableHeader className="">
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                           {headerGroup.headers.map((header) => {
                              return (
                                 <TableHead
                                    key={header.id}
                                    className={`
                                       ${
                                          header.column.getCanSort()
                                             ? "cursor-pointer"
                                             : ""
                                       }
                                       bg-primary/20
                                       first:rounded-tl-lg
                                       last:rounded-tr-lg
                                     `}
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
                              className="last:[&>td:first-child]:rounded-bl-lg last:[&>td:last-child]:rounded-br-lg border-b mb-1"
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
                              className="h-24 text-center rounded-b-lg bg-secondary"
                           >
                              No results.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </CardContent>
            <CardFooter className="justify-center">
               <div className="flex justify-center">
                  <Link
                     to={"/habit-archive"}
                     className="text-chart-4"
                  >
                     Archived Habit List
                  </Link>
               </div>
            </CardFooter>
         </Card>
      </div>
   );
}

export default Habit;
