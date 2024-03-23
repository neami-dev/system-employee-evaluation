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
import { addDays, format } from "date-fns";
import { useEffect } from "react";
import {
    getCheckInOutTimes,
    getClockifyUserData,
    getClockifyWorkSpaces,
} from "@/app/api/actions/clockifyActions";

// const data = [
//     {
//         id: "m5gr84i9",
//         amount: 316,
//         status: "success",
//         email: "ken99@yahoo.com",
//     },
//     {
//         id: "3u1reuv4",
//         amount: 242,
//         status: "success",
//         email: "Abe45@gmail.com",
//     },
//     {
//         id: "derv1ws0",
//         amount: 837,
//         status: "processing",
//         email: "Monserrat44@gmail.com",
//     },
//     {
//         id: "5kma53ae",
//         amount: 874,
//         status: "success",
//         email: "Silas22@gmail.com",
//     },
//     {
//         id: "bhqecj",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecjip",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqeckp",
//         amount: 721,
//         status: "late arrival",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecj",
//         amount: 721,
//         status: "late arrival",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecjip",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqeckp",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecj",
//         amount: 721,
//         status: "late arrival",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecjip",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqeckp",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecj",
//         amount: 721,
//         status: "late arrival",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqecjip",
//         amount: 721,
//         status: "absent",
//         email: "carmella@hotmail.com",
//     },
//     {
//         id: "bhqeckp",
//         amount: 721,

//         status: "late arrival",
//         email: "carmella@hotmail.com",
//     },
// ];

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
    // {
    //     accessorKey: "amount",
    //     header: () => <div className="text-left">Date</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue("amount"));

    //         // Format the amount as a dollar amount
    //         const formatted = new Intl.NumberFormat("en-US", {
    //             style: "currency",
    //             currency: "USD",
    //         }).format(amount);

    //         return <div className="text-left font-medium">{formatted}</div>;
    //     },
    // },
    {
        accessorKey: "date",
        header: () => <div className="text-center">date</div>,
        cell: ({ row }) => {
            return (
                <>
                    <div className="capitalize text-center ">
                        {row.getValue("date")}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "checkIn",
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
            <div className="lowercase">{row.getValue("date")}</div>
        ),
    },
    {
        accessorKey: "checkOut",
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
            <div className="lowercase">{row.getValue("checkOut")}</div>
        ),
    },
    {
        accessorKey: "status",
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
            <div className="lowercase">{row.getValue("status")}</div>
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
                            {/* {row.getValue("status")} */}
                        </div>
                    )}

                    {row.getValue("status") == "success" && (
                        <div className="capitalize text-center text-green-800 bg-[#b5ebc9] rounded-lg p-2 ">
                            {/* {row.getValue("status")} */}
                        </div>
                    )}
                    {row.getValue("status") == "processing" && (
                        <div className="capitalize text-center text-[#0764E6] bg-[#E6EFFC] rounded-lg p-2 ">
                            {/* {row.getValue("status")} */}
                        </div>
                    )}
                    {row.getValue("status") == "late arrival" && (
                        <div className="capitalize text-center text-[#D5B500] bg-[#e9e5dc] rounded-lg p-2 ">
                            {/* {row.getValue("status")} */}
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
    const [dateRange, setDate] = useState({
        from: new Date(2024, 2, 18),
        to: addDays(new Date(2024, 2, 21), 1),
    });

    const [timeEntries, setTimeEntries] = useState([]);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    // Simulated function to fetch time entries (replace with your actual Clockify API call)

    //   const TimeTrackingTable = ({ userId, workspaceId }) => {
    //     const [dateRange, setDateRange] = useState({
    //       from: new Date(),
    //       to: addDays(new Date(), 5),
    //     });
    useEffect(() => {
        const fetchAndSetTimeEntries = async () => {
            try {
                const [ClockifyUserData, ClockifyWorkSpaces] =
                    await Promise.all([
                        getClockifyUserData(),
                        getClockifyWorkSpaces(),
                    ]);
                console.log("ClockifyUserData : ", ClockifyUserData.id);
                console.log("ClockifyWorkSpaces : ", ClockifyWorkSpaces.id);

                const entries = [];
                for (
                    let date = dateRange.from;
                    date <= dateRange.to;
                    date = addDays(date, 1)
                ) {
                    // console.log("date : ", date);
                    const formattedDate = format(date, "yyyy-MM-dd");
                    const dailyEntries = await getCheckInOutTimes(
                        ClockifyUserData.id,
                        ClockifyWorkSpaces.id,
                        formattedDate
                    );
                    // console.log("dailyEntries: ",Object.keys(dailyEntries).length);
                    // Check if dailyEntries is not null and has elements
                    if (dailyEntries && Object.keys(dailyEntries).length > 0) {
                        console.log("yes");
                        const checkIn = dailyEntries.checkInTime;
                        const checkOut = dailyEntries.checkOutTime;
                        entries.push({
                            date: formattedDate,
                            checkIn: checkIn,
                            checkOut: new Date(checkOut).toLocaleTimeString(),
                        });
                    } else {
                        // Handle the case where there are no entries or dailyEntries is null
                        console.log("no");
                        entries.push({
                            date: formattedDate,
                            checkIn: "No check-in",
                            checkOut: "No check-out",
                        });
                    }
                }
                setTimeEntries(entries);
            } catch (error) {
                console.error("Error in fetchAndSetTimeEntries:", error);
            }
        };

        // Now call the async function
        fetchAndSetTimeEntries();
        console.log("dateRange : ", dateRange);
    }, [dateRange]);

    useEffect(() => {
        console.log("timeEntries : ", timeEntries);
    }, [timeEntries]);

    const table = useReactTable({
        data: timeEntries,
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
        <section className="flex justify-center">
            <div className="w-full mt-32 lg:w-[84%] lg:ml-[76px] xl:w-[86%] xl:ml-[82px]  mx-3 px-4 bg-white rounded-lg">
                <div className="flex flex-col sm:flex-row justify-center sm:justify-evenly flex-wrap items-center py-4">
                    <div className="">
                        <DatePickerWithRange
                            className=""
                            date={dateRange}
                            setDate={setDate}
                        />
                    </div>
                    <Input
                        placeholder="Filter emails..."
                        value={
                            table.getColumn("checkOut")?.getFilterValue() ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("checkOut")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm my-3 lg:mx-3"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className=" h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column, index) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            // key={column.id}
                                            key={index}
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
                                    {headerGroup.headers.map(
                                        (header, index) => {
                                            return (
                                                <TableHead
                                                    // key={header.id}
                                                    key={index}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        }
                                    )}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        // key={row.id}
                                        key={index}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell, index) => (
                                                <TableCell
                                                    key={index}
                                                    // key={cell.id}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
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
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
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
        </section>
    );
}
