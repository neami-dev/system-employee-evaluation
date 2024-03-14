"use client";
import { auth } from "@/firebase/firebase-config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { GoBell } from "react-icons/go";
import { LuCalendarRange } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";

export default function NavBar() {
    const [userData, setUserData] = useState("");
    auth.onAuthStateChanged((res) => {
        // console.log(res);
        setUserData(res);
    });
    async function logout() {
        await signOut(auth);
    }
    return (
        <>
            <nav className="flex flex-wrap items-center justify-between px-5  h-[83px]  bg-[#FFFFFF] rounded-[15px] m-auto mt-[33px]  w-[1229px]  shadow-[0_8px_28px_0px_#4859660D] ">
                <h2 className="uppercase font-bold self-center text-2xl  ">
                    <span className=" text-[#3354F4]">Wenear</span>{" "}
                    <span className=" text-[#b2b6cd]">Services</span>
                </h2>

                <div>
                    <ul className="flex gap-2 items-center">
                        <li className="relative mr-20">
                            <span className="   absolute  after:absolute after:h-12 after:w-[3px] after:bg-[#e2e2e2] top-[-2px] right-[-25px]"></span>
                            <LuSearch className="text-[#9295AB] absolute top-3 left-2" />
                            <Input
                                className=" rounded-[10px] w-[290px] border-none bg-[#F6F6F6] px-8 placeholder:text-[#b4b5ba] "
                                placeholder="Quick Search..."
                                type="text"
                            />
                        </li>
                        <ul className="flex gap-5">
                            <li className="bg-[#CFD7FD] mt-[4px] rounded-[50%] w-[33px] h-[33px] p-[6px] ">
                                <LuCalendarRange className="  text-[#7182B6] text-[20px]" />
                            </li>
                            <li className="bg-[#CFD7FD] mt-[4px] rounded-[50%] w-[33px] h-[33px] p-[6px]">
                                <GoBell className="  text-[#7182B6] text-[20px]   " />
                            </li>
                            <li>
                                <Avatar>
                                    <AvatarImage
                                        alt="User"
                                        src="https://github.com/shadcn.png"
                                    />
                                    <AvatarFallback className="capitalize">
                                        {userData?.displayName?.split("")[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </li>
                        </ul>
                        <li className="flex flex-col ">
                            <span className="text-sm capitalize">
                                {userData?.displayName}
                            </span>

                            <span className="text-sm">{userData?.email}</span>
                        </li>
                    </ul>
                    {/* <button
                            data-collapse-toggle="navbar-sticky"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-sticky"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button> */}
                </div>
            </nav>
        </>
    );
}
