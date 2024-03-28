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
import {
    ArrowUpDown,
    ChevronDown,
    Copy,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useEffect } from "react";
import { getEmployees } from "@/firebase/firebase-admin/getEmployees";
import getDocument from "@/firebase/firestore/getDocument";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteEmployee } from "@/firebase/firebase-admin/deleteEmployee";
import { test } from "@/firebase/firebase-admin/test";
import { auth } from "@/firebase/firebase-config";

export const columns = [
    {
        accessorKey: "uid",
        header: () => <div className="text-center">ID</div>,
        cell: ({ row }) => (
            <div className="text-[12px] text-center text-[#a9a7a7] md:text-[14px]">
                {row.getValue("uid")?.split("", 8) || "null"}
                ...
            </div>
        ),
    },
    {
        accessorKey: "displayName",
        header: ({ column }) => (
            <div
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="text-center flex justify-center items-center cursor-pointer rounded-sm hover:bg-gray-200"
            >
                Full Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => (
            <div className="lowercase text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                {row.getValue("displayName") || "null"}
            </div>
        ),
    },
    {
        accessorKey: "joiningDate",
        header: () => (
            <>
                <div className="text-center ">Joining Date</div>
            </>
        ),

        cell: ({ row }) => {
            return (
                <div className="text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                    {row.getValue("joiningDate") || "null"}
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: () => <div className="text-center">Role</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                    {row.getValue("role") || "null"}
                </div>
            );
        },
    },
    {
        accessorKey: "department",
        header: () => <div className="text-center"> Department</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                    {row.getValue("department") || "null"}
                </div>
            );
        },
    },
    {
        accessorKey: "currentTasks",
        header: () => <div className="text-center">Current Tasks</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                    {row.getValue("currentTasks") || "null"}
                </div>
            );
        },
    },
    {
        accessorKey: "score",
        header: ({ column }) => (
            <div
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="text-center flex justify-center items-center cursor-pointer rounded-sm hover:bg-gray-200"
            >
                Score <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="mx-auto bg-[#39B5A6] text-white rounded-full w-[40px] h-[40px] text-center pt-2.5  text-[12px] md:text-[14px]">
                    {row.getValue("score") || "null"}%
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,

        cell: ({ row }) => {
            const employee = row.original;

            return (
                <div className="w-full flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(employee.uid)
                                }
                            >
                                <div className="flex cursor-pointer">
                                    <Copy className="mr-2" size={18} />
                                    Copy ID
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className=" flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f2f3f2]  ">
                                            <Trash2
                                                className="mr-2"
                                                size={18}
                                            />
                                            Delete
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete
                                                account and remove data from our
                                                servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-700"
                                                onClick={() => {
                                                    deleteEmployee(
                                                        employee.uid
                                                    );
                                                }}
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem></DropdownMenuItem>
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
const jsxElement = (
    <>
        <Skeleton className=" h-10 w-[100%] rounded-sm mb-2" />
        <hr />
        <Skeleton className=" h-10 w-[100%] rounded-sm my-2" />
        <hr />
        <Skeleton className=" h-10 w-[100%] rounded-sm my-2" />
        <hr />
        <Skeleton className=" h-10 w-[100%] rounded-sm mt-2" />
    </>
);
export default function DataTableDemo() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [textNoResults, setTextNoResults] = useState(jsxElement);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
       console.log( auth.onAuthStateChanged((i)=>{
        console.log(i);
       }));
        test()
        setTimeout(() => {
            setTextNoResults(<>No Results!</>);
        }, 10000);
    }, []);

    useEffect(() => {
        const getData = async () => {
            const newData = [];
            const employees = await getEmployees();
            await Promise.all(
                employees.result?.users?.map(async (user) => {
                    const res = await getDocument("userData", user?.uid);
                    if (
                        res.result !== null &&
                        res.result?.data() !== undefined
                    ) {
                        if (user?.uid == res.result.id) {
                            newData.push({
                                ...user,
                                joiningDate: new Date(
                                    user?.metadata?.creationTime
                                ).toLocaleDateString(),
                                ...res.result?.data(),
                            });
                        }
                    }
                })
            );
            setUserData(newData);
        };
        getData();
    }, []);

    console.log(userData);
    const table = useReactTable({
        data: userData || [],
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
            <div className="w-[94%] mt-32 min-[426px]:w-[80%] min-[426px]:ml-[76px] sm:w-[80%] sm:ml-[84px] lg:w-[82%] lg:ml-[96px] mx-3 px-4 bg-white rounded-lg">
                <div className="w-full flex p-4">
                    <Input
                        placeholder="Filter Full Names..."
                        value={
                            table.getColumn("displayName")?.getFilterValue() ??
                            ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("displayName")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

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
                                                          header.column
                                                              .columnDef.header,
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
                                        {textNoResults}
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
