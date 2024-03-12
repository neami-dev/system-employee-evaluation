"use client";
import { auth } from "@/firebase/firebase-config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";

export default function NavBarEmployee() {
    const [userData, setUserData] = useState("");
    auth.onAuthStateChanged((res) => {
        console.log(res);
        setUserData(res);
    });
    async function logout() {
        await signOut(auth);
    }
    return (
        <>
            <nav className=" bg-[#FFFFFF] rounded-[15px] m-auto mt-[33px]  w-[1229px] h-[83px] shadow-[0_8px_28px_0px_#4859660D] ">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    
                         
                        <h2 className="uppercase font-bold self-center text-2xl  ">
                        <span className=" text-[#3354F4]">Wenear</span> <span className=" text-[#b2b6cd]">Services</span>
                        </h2>
                    
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {/* <Avatar >
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar> */}
                        <div>
                            <h4>{userData?.displayName}</h4>

                            <h4>{userData?.email}</h4>
                        </div>

                        <button
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
                        </button>
                    </div>
                    <div
                        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                        id="navbar-sticky"
                    >
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                                    aria-current="page"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/auth/loginPage"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/invitationPage"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    register
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    log Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
