"use client";
import { auth } from "@/firebase/firebase-config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { LuCalendarRange } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
    BellIcon,
    CalendarDays,
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Search,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
export default function NavBar() {
    const [userData, setUserData] = useState("");
    const [date, setDate] = useState(new Date());

    auth.onAuthStateChanged((res) => {
        // console.log(res);
        setUserData(res);
    });
    async function logout() {
        signOut(auth)
            .then(() => {
                console.log("logged out");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            {/* {date?.toDateString()} */}
            <nav className="flex flex-wrap items-center justify-between px-5  h-[83px]  bg-[#FFFFFF] rounded-[15px] m-auto mt-[33px]  w-[1229px]  shadow-[0_8px_28px_0px_#4859660D] ">
                <h2 className="uppercase font-bold self-center text-2xl  ">
                    <span className=" text-[#3354F4]">Wenear</span>{" "}
                    <span className=" text-[#b2b6cd]">Services</span>
                </h2>

                <div>
                    <ul className="flex gap-2 items-center">
                        <li className="relative mr-20 cursor-pointer">
                            <span className="   absolute  after:absolute after:h-12 after:w-[3px] after:bg-[#e2e2e2] top-[-2px] right-[-25px]"></span>

                            <Search
                                size={18}
                                strokeWidth={1.8}
                                className="text-[#9295AB] absolute top-3 left-2"
                            />
                            <Input
                                className=" rounded-[10px] w-[290px] border-none bg-[#F6F6F6] px-8 placeholder:text-[#b4b5ba] "
                                placeholder="Quick Search..."
                                type="text"
                            />
                        </li>
                        <ul className="flex gap-5">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <li className="bg-[#CFD7FD] mt-[4px] rounded-full w-[33px] h-[33px] p-[6px] relative cursor-pointer ">
                                        <CalendarDays
                                            size={20}
                                            strokeWidth={1.8}
                                            className="text-[#7182B6]"
                                        />
                                    </li>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <li className="bg-[#CFD7FD] mt-[4px] rounded-full w-[33px] h-[33px] p-[6px] cursor-pointer">
                                <BellIcon
                                    size={20}
                                    strokeWidth={1.8}
                                    className="text-[#7182B6] "
                                />
                            </li>

                            <li>
                                {!userData ? (
                                    <div className="flex items-center">
                                        <Skeleton className="h-10 w-10 rounded-full mr-1" />
                                        <div className="">
                                            <Skeleton className="h-3 w-[60px] my-1 " />
                                            <Skeleton className="h-3 w-[120px] mt-2" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div >
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Avatar className="cursor-pointer">
                                                        <AvatarImage
                                                            alt="User"
                                                            src="https://github.com/shadcn.png"
                                                        />
                                                        <AvatarFallback className="capitalize">
                                                            {
                                                                userData?.displayName?.split(
                                                                    ""
                                                                )[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-48">
                                                    <DropdownMenuLabel>
                                                        My Account
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <User className="mr-2 h-4 w-4" />
                                                            <span>Profile</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem>
                                                            <Settings className="mr-2 h-4 w-4" />
                                                            <span>
                                                                Settings
                                                            </span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <Users className="mr-2 h-4 w-4" />
                                                            <span>Team</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem>
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        <span>
                                                                            Email
                                                                        </span>
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuSeparator />
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Github className="mr-2 h-4 w-4" />
                                                        <span>GitHub</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={logout}
                                                    >
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span>Log out</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </>
                                )}
                            </li>
                        </ul>
                        <li className="flex flex-col ">
                            <span className="text-sm capitalize">
                                {userData?.displayName}
                            </span>

                            <span className="text-sm">{userData?.email}</span>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
