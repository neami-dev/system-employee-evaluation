"use client";
import { auth } from "@/firebase/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import removetokens, { CheckTokens } from "@/app/api_services/actions/removetokens";
export default function NavBar() {
    const [userData, setUserData] = useState({});
    const [isLogged, setIslogged] = useState(false);
    const route = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        CheckTokens().then((checkTk) => {
            console.log("checkTk :", checkTk);
        });
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIslogged(true);
                setUserData(user);
            } else {
                removetokens().then((tokenRemoved) => {
                    console.log("tokenRemoved :", tokenRemoved);
                    if (tokenRemoved) {
                        route.push("/login");
                    }
                });
            }
        });
    }, []);
    
    async function logout() {
        signOut(auth)
            .then(() => {
                toast({
                    description: "logged out sccessfully",
                });
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    description: "logged out error",
                });
                // removetokens()
                console.log(err);
            });
    }
    if (isLogged) {
        return (
            <>
                {/* {date?.toDateString()} */}
                <nav className=" fixed top-2 z-10 left-[4%] max-[865px]:left-[2%] w-[92%]  max-[865px]:w-[94%]  flex items-center justify-between px-5 mt-5 max-[865px]:mt-3 h-[75px]  max-[425px]:h-[70px]  bg-[#FFFFFF] rounded-[15px] m-auto shadow-[0_8px_28px_0px_#4859660D] ">
                    <h2 className="uppercase font-bold self-center text-3xl">
                        <span className=" text-[#3354F4] max-[770px]:text-[30px] ">
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
                                            <div className="flex flex-row gap-x-3">
                                                <Avatar className="cursor-pointer">
                                                    <AvatarImage
                                                        alt="User"
                                                        src={userData?.photoURL}
                                                    />
                                                    <AvatarFallback className="capitalize">
                                                        {
                                                            userData?.displayName?.split(
                                                                ""
                                                            )[0]
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* email and name */}
                                                <div className="flex flex-col cursor-pointer max-[550px]:hidden">
                                                    <span className="text-sm capitalize">
                                                        {userData?.displayName}
                                                    </span>

                                                    <span className="text-sm">
                                                        {userData?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className=" w-[110px]">
                                            <DropdownMenuLabel>
                                                My Account
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <Link href="/employee/profile">
                                                    <DropdownMenuItem>
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>Profile </span>
                                                    </DropdownMenuItem>
                                                </Link>

                                                <Link href="/employee/settings">
                                                    <DropdownMenuItem>
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        <span>Settings</span>
                                                    </DropdownMenuItem>
                                                </Link>
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
                                            <DropdownMenuItem onClick={logout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </li>
                    </ul>
                </nav>
            </>
        );
    }
}
