"use client";
import { createEmployee } from "@/firebase/firebase-admin/createEmployee";
import { deleteEmployee } from "@/firebase/firebase-admin/deleteEmployee";
import { getEmployees } from "@/firebase/firebase-admin/getEmployees";
import getDocument from "@/firebase/firestore/getDocument";
import getDocuments from "@/firebase/firestore/getDocuments";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import Loading from "@/components/component/Loading";
export const columns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <div
                className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                variant="ghost"
            >
                Id
            </div>
        ),
        cell: ({ row }) => {
            return (
                <>
                    <div className="capitalize text-center ">
                        {row.getValue("id")}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "fullName",
        header: () => <div className="text-center">Full Name</div>,
        cell: ({ row }) => {
            return (
                <>
                    <div className="justify-center"></div>
                    <div className="capitalize w-[40px] text-center ">
                        {row.getValue("fullName") !== undefined
                            ? row.getValue("fullName")
                            : "null"}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "joiningDate",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Joining Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("joiningDate") !== undefined
                    ? row.getValue("joiningDate")
                    : "null"}
            </div>
        ),
    },
    {
        accessorKey: "department",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    // onClick={() =>
                    //     column.toggleSorting(column.getIsSorted() === "asc")
                    // }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Department
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("department") !== undefined
                    ? row.getValue("department")
                    : "null"}
            </div>
        ),
    },
    {
        accessorKey: "currentTasks",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Current Tasks
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("currentTasks") !== undefined
                    ? row.getValue("currentTasks")
                    : "null"}
            </div>
        ),
    },
    {
        accessorKey: "score",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">
                {row.getValue("score") !== undefined
                    ? row.getValue("score")
                    : "null"}
            </div>
        ),
    },
    {
        accessorKey: "Actions",
        header: ({ column }) => {
            return (
                <div
                    variant="ghost"
                    // onClick={() =>
                    // column.toggleSorting(column.getIsSorted() === "asc")
                    // }
                    className="text-center flex justify-center items-center cursor-pointer hover:bg-gray-200"
                >
                    Actions
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase text-center">{row.getValue("score")}</div>
        ),
    },
];
export default function manageEmployees() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [userData, setUserData] = useState([]);
    // deleteEmployee("eubtvH7jfzMstBsSLNAdWGKr1k03")
    const getInfo = async () => {
        // const { employees } = await Promise.all([getEmployees()]);
        // const newUser = await createEmployee({
        //     email: "khalid2@gmail.com",
        //     emailVerified: true,
        //     password: "123456",
        // });
        const employees = await getEmployees();
        const newData = [];
        await Promise.all(
            employees.result?.users?.map(async (user) => {
                const res = await getDocument("userData", user?.uid);
                if (res.result !== null && res.result?.data() !== undefined) {
                    if (user?.uid == res.result.id) {
                        newData.push({
                            ...user,
                            id: res.result.id,
                            ...res.result?.data(),
                        });
                    }
                }
            })
        );
        setUserData(newData);
    };
    useEffect(() => {
        getInfo();
    }, [userData]);
    // console.log("userData", userData);
    // setFirestoreData(newData);
    const data = [
        {
            joiningDate: "29 July 2023",
            department: "Mobile Development",
            currentTasks: 7,
            score: "78%",
        },
        {
            clickupToken:
                "62619802_c38ee019cfbde9c50f6ce93b06a5349de8547e17edef53a4594046ffa1290fa3",
            disabled: false,
            displayName: "amine",
            email: "amine@gmail.com",
            emailVerified: false,
            githubRepo: "Neamitest/system-employee-evaluation",
            githubToken: "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",
            id: "EAdgDXuyaXZSwlsndN9WbrEXTgD2",
        },
    ];

    const table = useReactTable({
        data: data,
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
                    <div className=""></div>
                    <Input
                        placeholder="Filter emails..."
                        value={table.getColumn("id")?.getFilterValue() ?? ""}
                        onChange={(event) =>
                            table
                                .getColumn("id")
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
