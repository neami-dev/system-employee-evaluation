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
    ShieldCheck,
    TicketCheck,
    Trash2,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

import { auth } from "@/firebase/firebase-config";
import { employeeToAdmin } from "@/firebase/firebase-admin/employeeToAdmin";
import { adminToEmployee } from "@/firebase/firebase-admin/adminToEmployee";
import { useToast } from "@/components/ui/use-toast";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import emailjs from "@emailjs/browser";
import { updateEmployee } from "@/firebase/firebase-admin/updateEmployee";
import { Switch } from "@/components/ui/switch";
import { addCookie } from "@/app/api_services/actions/handleCookies";
import Loading from "@/components/component/Loading";
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
    const [isAdmin, setIsAdmin] = useState(false);

    const [showEmailVerified, setShowEmailVerified] = useState(true);
    const { toast } = useToast();
    const route = useRouter();

    useEffect(() => {
        setIsAdmin(getCookie("isAdmin"));
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const response = await checkRoleAdmin(user.uid);
                setIsAdmin(response?.result);
                // addCookie("isAdmin", response?.result);

                if (!response?.result) {
                    route.push("/Not-Found");
                    console.log("your role is not admin");
                }
            } else {
                route.push("/login");
                console.log("logout from manageEmployee ");
            }
        });
    }, []);
    // get user data from firebase
    const getData = async () => {
        const newData = [];
        const employees = await getEmployees();

        if (employees.result !== null && employees.error == null) {
            await Promise.all(
                employees.result?.map(async (user) => {
                    const response = await getDocument("userData", user?.uid);

                    if (response.result !== null && response.error == null) {
                        if (
                            user?.uid == response.result.id &&
                            response.result?.data() !== undefined &&
                            user?.emailVerified === showEmailVerified
                        ) {
                            newData.push({
                                ...user,
                                role:
                                    user?.customClaims?.admin == true
                                        ? "admin"
                                        : "employee",

                                joiningDate: new Date(
                                    user?.metadata?.creationTime
                                ).toLocaleDateString(),
                                ...response.result?.data(),
                            });
                        } else {
                            setTextNoResults(<p>No Results!</p>);
                        }
                    } else if (res.error) {
                        setTextNoResults(<p>No Results!</p>);
                    }
                })
            );
            setUserData(newData);
        } else {
            setTextNoResults(<p>No Results!</p>);
        }
    };

    const sendEmail = async (email, name) => {
        let result,
            error = null;
        try {
            const serviceId = "service_a1roonf";
            const templateId = "template_0ghvdlq";
            const public_Key = "O2D3oYIQTP6Jad7ON";

            const emailParams = {
                user_name: name,
                message: `Thank you for signing up on systeme evaliation employees
                We're excited to have you on board and will be happy to help you set everything up.`,
                user_email: email,
            };

            result = await emailjs.send(
                serviceId,
                templateId,
                emailParams,
                public_Key
            );
        } catch (e) {
            error = e;
        }
        return { result, error };
    };

    useEffect(() => {
        getData();
    }, [showEmailVerified]);
    const hahdleDelete = async (uid) => {
        const res = await deleteEmployee(uid);
        res.error == null &&
            toast({
                description: "Deleted employee sccessfully",
            });
        res.error &&
            toast({
                variant: "destructive",
                description: "Deleting error",
            });
        getData();
    };

    const checkEmailIsVerified = (uid) => {
        const result = userData?.find((user) => user.uid == uid);
        return (
            <div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            {result?.emailVerified === false && (
                                <div className=" flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f2f3f2]  ">
                                    <TicketCheck className="mr-2" size={18} />
                                    send valid email
                                </div>
                            )}
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    if (result?.emailVerified === false) {
                                        const res = await sendEmail(
                                            result?.email,
                                            result?.displayName
                                        );
                                        if (res?.result?.text == "OK") {
                                            <DropdownMenuSeparator />;
                                            const res = await updateEmployee({
                                                uid: result?.uid,
                                                emailVerified: true,
                                            });
                                            if (res?.result === true) {
                                                toast({
                                                    description:
                                                        "Email sent successfully",
                                                });
                                                getData();
                                            }
                                        } else if (res?.error) {
                                            toast({
                                                variant: "destructive",
                                                description:
                                                    res?.error?.text ||
                                                    "error while sending email",
                                            });
                                        }
                                    }
                                }}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };
    const checkRole = (uid) => {
        const result = userData?.find((user) => user.uid == uid);
        if (result?.role) {
            return (
                <>
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div>
                                    {result?.role == "employee" && (
                                        <div className=" flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f2f3f2]  ">
                                            <ShieldCheck
                                                className="mr-2"
                                                size={18}
                                            />
                                            become admin
                                        </div>
                                    )}
                                    {result?.role == "admin" && (
                                        <div className=" flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f2f3f2]  ">
                                            <User className="mr-2" size={18} />
                                            become employee
                                        </div>
                                    )}
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={async () => {
                                            if (result?.role == "employee") {
                                                const res =
                                                    await employeeToAdmin(uid);

                                                getData();
                                                if (res.error == null) {
                                                    toast({
                                                        description:
                                                            "Sccessfully transformed into a admin",
                                                    });
                                                }
                                            } else if (
                                                result?.role == "admin"
                                            ) {
                                                const res =
                                                    await adminToEmployee(uid);
                                                if (res.error == null) {
                                                    getData();
                                                    toast({
                                                        description:
                                                            "Sccessfully transformed into a employee",
                                                    });
                                                }
                                            }
                                        }}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            );
        }
    };

    const columns = [
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
            accessorKey: "email",
            header: ({ column }) => (
                <div className="text-center flex justify-center items-center cursor-pointer rounded-sm hover:bg-gray-200">
                    Email
                </div>
            ),
            cell: ({ row }) => (
                <div className="lowercase text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                    {row.getValue("email") || "null"}
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
            accessorKey: "emailVerified",
            header: () => <div className="text-center">email verified</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center text-[#a9a7a7] text-[12px] md:text-[14px]">
                        {JSON.stringify(row.getValue("emailVerified")) ||
                            "null"}
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
                        {row.getValue("score") || 0}%
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
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            employee?.uid
                                        );
                                        toast({
                                            description:
                                                "it copied successfully",
                                        });
                                    }}
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
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete account
                                                    and remove data from our
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
                                                        hahdleDelete(
                                                            employee?.uid
                                                        );
                                                    }}
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <DropdownMenuSeparator />
                                <div>{checkRole(employee?.uid)}</div>
                                <DropdownMenuSeparator />
                                <div>{checkEmailIsVerified(employee?.uid)}</div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

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

    if (String(isAdmin)?.toLowerCase() === "true") {
        return (
            <>
                <section className="flex justify-center">
                    <div className="w-[94%] mt-32 min-[426px]:w-[80%] min-[426px]:ml-[76px] sm:w-[80%] sm:ml-[84px] lg:w-[82%] lg:ml-[96px] mx-3 px-4 bg-white rounded-lg">
                        <div className="w-full flex py-4 justify-between">
                            <Input
                                placeholder="Filter Full Names..."
                                value={
                                    table
                                        .getColumn("displayName")
                                        ?.getFilterValue() ?? ""
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn("displayName")
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />

                            <div className="flex items-center gap-3 ml-1 ">
                                <div className="flex items-center gap-0.5 ">
                                    <Switch
                                        id="Email-verified"
                                        onCheckedChange={(bool) => {
                                            setShowEmailVerified(!bool);
                                        }}
                                    />

                                    <label
                                        className="text-[14px] hidden lg:block"
                                        htmlFor="Email-verified"
                                    >
                                        Emails not validated
                                    </label>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="ml-auto"
                                        >
                                            Columns{" "}
                                            <ChevronDown className="ml-4 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {table
                                            .getAllColumns()
                                            .filter((column) =>
                                                column.getCanHide()
                                            )
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(
                                                            value
                                                        ) =>
                                                            column.toggleVisibility(
                                                                !!value
                                                            )
                                                        }
                                                    >
                                                        {column.id}
                                                    </DropdownMenuCheckboxItem>
                                                );
                                            })}
                                        <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
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
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() &&
                                                    "selected"
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
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
                                                {textNoResults}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {
                                    table.getFilteredSelectedRowModel().rows
                                        .length
                                }{" "}
                                of {table.getFilteredRowModel().rows.length}{" "}
                                row(s) selected.
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
            </>
        );
    }else{
        return <Loading/>
    }
}
