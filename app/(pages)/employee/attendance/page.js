"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DatePickerWithRange } from "@/components/component/DateRangePicker";

const data = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@gmail.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@gmail.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@gmail.com",
    },
    {
        id: "bhqecj",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecjip",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqeckp",
        amount: 721,
        status: "late arrival",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecj",
        amount: 721,
        status: "late arrival",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecjip",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqeckp",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecj",
        amount: 721,
        status: "late arrival",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecjip",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqeckp",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecj",
        amount: 721,
        status: "late arrival",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecjip",
        amount: 721,
        status: "absent",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqeckp",
        amount: 721,

        status: "late arrival",
        email: "carmella@hotmail.com",
    },
];

// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

export const columns = [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "amount",
        header: () => <div className="text-left">Date</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-left font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Day</div>,
        cell: ({ row }) => {
            return (
                <>
                    <div className="capitalize text-center ">
                        {row.getValue("status")}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Check-in
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "email2",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Check-out
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "email3",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Work hours
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            return (
                <>
                    {row.getValue("status") == "absent" && (
                        <div className="capitalize text-center text-[#AA0000] bg-[#FFE5EE] rounded-lg p-2 ">
                            {row.getValue("status")}
                        </div>
                    )}

                    {row.getValue("status") == "success" && (
                        <div className="capitalize text-center text-green-800 bg-[#b5ebc9] rounded-lg p-2 ">
                            {row.getValue("status")}
                        </div>
                    )}
                    {row.getValue("status") == "processing" && (
                        <div className="capitalize text-center text-[#0764E6] bg-[#E6EFFC] rounded-lg p-2 ">
                            {row.getValue("status")}
                        </div>
                    )}
                    {row.getValue("status") == "late arrival" && (
                        <div className="capitalize text-center text-[#D5B500] bg-[#e9e5dc] rounded-lg p-2 ">
                            {row.getValue("status")}
                        </div>
                    )}
                </>
            );
        },
    },

    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const payment = row.original;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() =>
    //                             navigator.clipboard.writeText(payment.id)
    //                         }
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         View payment details
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];

export default function DataTableDemo() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    
// Simulated function to fetch time entries (replace with your actual Clockify API call)
// const fetchTimeEntriesForDate = async (userId, workspaceId, date) => {
//     // Replace this with an actual API call to fetch time entries
//     return [
//       { timeInterval: { start: `${date}T08:00:00Z`, end: `${date}T12:00:00Z` } },
//       { timeInterval: { start: `${date}T13:00:00Z`, end: `${date}T17:00:00Z` } },
//     ];
//   };
  
//   const TimeTrackingTable = ({ userId, workspaceId }) => {
//     const [dateRange, setDateRange] = useState({
//       from: new Date(),
//       to: addDays(new Date(), 5),
//     });
//     const [timeEntries, setTimeEntries] = useState([]);
  
//     useEffect(() => {
//       const fetchAndSetTimeEntries = async () => {
//         const entries = [];
//         for (let date = dateRange.from; date <= dateRange.to; date = addDays(date, 1)) {
//           const formattedDate = format(date, 'yyyy-MM-dd');
//           const dailyEntries = await fetchTimeEntriesForDate(userId, workspaceId, formattedDate);
//           if (dailyEntries.length > 0) {
//             const checkIn = dailyEntries[0].timeInterval.start;
//             const checkOut = dailyEntries[dailyEntries.length - 1].timeInterval.end;
//             entries.push({
//               date: formattedDate,
//               checkIn: new Date(checkIn).toLocaleTimeString(),
//               checkOut: new Date(checkOut).toLocaleTimeString(),
//             });
//           }
//         }
//         setTimeEntries(entries);
//       };
  
//       fetchAndSetTimeEntries();
//     }, [userId, workspaceId, dateRange]);
  

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full mt-32  mx-3 px-4 bg-white rounded-lg">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={table.getColumn("email")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table
                        .getColumn("email")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div>
                    <DatePickerWithRange className="ml-auto mx-5" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
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
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
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
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
