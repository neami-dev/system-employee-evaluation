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
import Loading from "@/components/component/Loading";

function parseTimeToMinutes(timeString) {
    if (typeof timeString !== "string") {
        // console.error('parseTime expects a string input, got:', typeof timeString);
        return 0; // Or handle this case as appropriate for your application
    }

    // Attempt to extract the time and period parts from the input string
    const parts = timeString.split(" ");
    if (parts.length < 2) {
        // console.error('parseTime received an incorrectly formatted string:', timeString);
        return 0; // Or handle this case as appropriate for your application
    }

    let [time, period] = parts;
    let [hours, minutes] = time.split(":").map(Number);

    // Adjust hours based on the period
    if (period && period.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (period && period.toLowerCase() === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes; // Return the total minutes
}
function calculateWorkHoursMessage(checkInTime, checkOutTime) {
    // Check if either check-in or check-out time is "---"
    if (checkInTime === "---" || checkOutTime === "---") {
        return "Absent";
    }
    // Calculate the duration in minutes
    const durationMinutes =
        parseTimeToMinutes(checkOutTime) - parseTimeToMinutes(checkInTime);

    // Convert duration to hours
    const durationHours = durationMinutes / 60;

    // Determine the message based on the duration
    if (durationHours > 8) {
        return "Excellent work";
    } else if (durationHours === 8) {
        return "Well done";
    } else {
        return "Not completed";
    }
}

function calculateAndFormatTimeDifference(checkIn, checkOut) {
    // Check if either check-in or check-out time is "---"
    if (checkIn === "---" || checkOut === "---") {
        return "---";
    }

    // Calculate the difference in minutes
    const differenceInMinutes =
        parseTimeToMinutes(checkOut) - parseTimeToMinutes(checkIn);

    // Format and return the difference
    return formatDurationToHoursMinutes(differenceInMinutes);
}

function formatDurationToHoursMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h : ${minutes}m`;
}

function formatTime(timeString) {
    if (typeof timeString !== "string") {
        console.error(
            "formatTime expects a string input, got:",
            typeof timeString
        );
        return ""; // Or return a default string, or handle the error as appropriate
    }
    // Split the time and the period (am/pm)
    const [time, period] = timeString.split(" ");

    // Split the time into hours, minutes, and seconds
    const [hours, minutes, seconds] = time.split(":");

    // Reassemble the string in the desired format
    const formattedTime = `${hours}h : ${minutes}m : ${seconds}s ${period}`;

    return formattedTime;
}

function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

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
        header: ({ column }) => (
            <div
                className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
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
        accessorKey: "day",
        header: () => <div className="text-center">day</div>,
        cell: ({ row }) => {
            return (
                <>
                    <div className="justify-center"></div>
                    <div className="capitalize w-[40px] text-left ">
                        {getDayName(row.getValue("date"))}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "checkIn",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Check-in
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("checkIn") !== "---"
                    ? formatTime(row.getValue("checkIn"))
                    : "---"}
            </div>
        ),
    },
    {
        accessorKey: "checkOut",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Check-out
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("checkOut") !== "---"
                    ? formatTime(row.getValue("checkOut"))
                    : "---"}
            </div>
        ),
    },
    {
        accessorKey: "Work hours",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Work hours
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {calculateAndFormatTimeDifference(
                    row.getValue("checkIn"),
                    row.getValue("checkOut")
                )}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            return (
                <>
                    {calculateWorkHoursMessage(
                        row.getValue("checkIn"),
                        row.getValue("checkOut")
                    ) == "Excellent work" && (
                        <div className="capitalize text-center text-white font-bold bg-green-500 rounded-lg p-2 ">
                            Excellent work
                        </div>
                    )}

                    {calculateWorkHoursMessage(
                        row.getValue("checkIn"),
                        row.getValue("checkOut")
                    ) == "Well done" && (
                        <div className="capitalize text-center text-white font-bold bg-green-500 rounded-lg p-2 ">
                            Well done
                        </div>
                    )}
                    {calculateWorkHoursMessage(
                        row.getValue("checkIn"),
                        row.getValue("checkOut")
                    ) == "Not completed" && (
                        <div className="capitalize text-center font-bold text-red-700 bg-red-200 rounded-lg p-2 ">
                            Not completed
                        </div>
                    )}
                    {calculateWorkHoursMessage(
                        row.getValue("checkIn"),
                        row.getValue("checkOut")
                    ) == "Absent" && (
                        <div className="capitalize text-center font-bold text-red-700 bg-red-200 rounded-lg p-2 ">
                            Absent
                        </div>
                    )}
                    {
                        // row.getValue("status") == "late arrival" && (
                        //     <div className="capitalize text-center text-[#D5B500] bg-[#e9e5dc] rounded-lg p-2 ">
                        //         {/* {row.getValue("status")} */}
                        //     </div>
                        // )
                    }
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
                // console.log("ClockifyUserData : ", ClockifyUserData.id);
                // console.log("ClockifyWorkSpaces : ", ClockifyWorkSpaces.id);

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
                        // console.log("yes");
                        const checkIn = dailyEntries.checkInTime;
                        const checkOut = dailyEntries.checkOutTime;
                        entries.push({
                            date: formattedDate,
                            checkIn: checkIn,
                            checkOut: checkOut,
                        });
                    } else {
                        // Handle the case where there are no entries or dailyEntries is null
                        // console.log("no");
                        entries.push({
                            date: formattedDate,
                            checkIn: "---",
                            checkOut: "---",
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
                                        {/* No results. */}
                                        <Loading />
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
