"use client";
import { auth } from "@/firebase/firebase-config";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BellIcon,
    Github,
    LogOut,
    Mail,
    Settings,
    User,
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
export default function NavBar() {
    const [userData, setUserData] = useState("");

    useEffect(() => {
        auth.onAuthStateChanged((res) => {
            // console.log(res);
            setUserData(res);
        });
    }, [userData]);
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
            <nav className="flex items-center justify-between px-5 mt-5 h-[75px]  max-[425px]:h-[70px]  bg-[#FFFFFF] rounded-[15px] m-auto  w-[92%] max-[425px]:w-[94%] shadow-[0_8px_28px_0px_#4859660D] ">
                <h2 className="uppercase font-bold self-center text-3xl">
                    <span className=" text-[#3354F4] max-[770px]:text-xl max-[425px]:text-base">
                        Wenear
                    </span>{" "}
                    <span className=" text-[#b2b6cdb1] max-[770px]:text-sm max-[425px]:text-xs">
                        Services
                    </span>
                </h2>
                <ul className="flex gap-2 items-center">
                    {/* the icon notification */}
                    <li className="bg-[#CFD7FD] mr-2  mt-1 rounded-full w-[33px] h-[33px] p-[6px]  cursor-pointer">
                        <BellIcon
                            size={20}
                            strokeWidth={1.8}
                            className="text-[#7182B6] "
                        />
                    </li>
                    {/* the profile icon  and option list */}
                    <li>
                        {!userData ? (
                            <div className="flex items-center">
                                <Skeleton className="h-10 w-10 rounded-full mr-1" />
                                <div className="">
                                    <Skeleton className="h-3 w-[60px] my-1 max-[550px]:hidden" />
                                    <Skeleton className="h-3 w-[120px] mt-2 max-[550px]:hidden" />
                                </div>
                            </div>
                        ) : (
                            <>
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
                                    <DropdownMenuContent className=" w-[110px]">
                                        <DropdownMenuLabel>
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile 10</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
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
                                                            <span>Email</span>
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
                                        <DropdownMenuItem onClick={logout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </li>

                    {/* email and name */}
                    <li className="flex flex-col max-[550px]:hidden">
                        <span className="text-sm capitalize">
                            {userData?.displayName}
                        </span>

                        <span className="text-sm">{userData?.email}</span>
                    </li>
                </ul>
            </nav>
        </>
    );
}
