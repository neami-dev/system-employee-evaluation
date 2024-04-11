"use client";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Blocks,
    MessageSquareText,
    UserPlus,
    History,
    Users,
    ShieldHalf,
    User,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { onAuthStateChanged } from "firebase/auth";

export default function Menu() {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogged, setIslogged] = useState(false);
    const route = useRouter();

    useEffect(() => {
        const interVal = setInterval(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIslogged(true);
                const res = await getDocument("userData", user.uid);
                if (
                    !res.result?.data()?.ClockifyWorkspace ||
                    // !res.result?.data()?.clockifyApiKey ||
                    // !res.result?.data()?.clockifyUserId ||
                    !res.result?.data()?.clickupToken ||
                    !res.result?.data()?.githubToken ||
                    !res.result?.data()?.githubRepo
                ) {
                    route.push("/services");
                    console.log("lack of information");
                }
                const response = await checkRoleAdmin(user.uid);
                setIsAdmin(response?.result);
            } else {
                route.push("/login");
                console.log("logout from menu");
            }
        });
        }, 1000);
        return () => clearInterval(interVal);
    }, []);

    const JSXspan = (
        <span className="before:absolute before:h-10   before:w-[6px]  before:bg-[#3354F4] before:left-[-21px]  before:top-[-8px]  before:rounded-r-lg menu-line "></span>
    );
    if (isLogged) {
        return (
            <>
                <div className=" menu fixed w-10  z-10 top-36 left-[4%] max-[865px]:left-[2%] max-[425px]:w-[100%]">
                    <ul className="bg-white text-[#A3AED0] rounded-xl flex flex-wrap  gap-8 flex-col max-[425px]:flex-row justify-around items-center  w-[68px] max-[425px]:w-[100%]  max-[425px]:rounded-b-none py-5 max-[425px]:py-3 max-[425px]:px-5 shadow-[0_8px_28px_0px_#4859660D]">
                        <li
                            className={`relative hover:text-[#3354F4]  cursor-pointer ${
                                pathname === "/employee/dashboard" ||
                                pathname === "/admin/dashboard"
                                    ? "text-[#3354F4]"
                                    : "text-[#A3AED0]"
                            }`}
                        >
                            {pathname === "/employee/dashboard" ||
                            pathname === "/admin/dashboard"
                                ? JSXspan
                                : null}
                            {isAdmin ? (
                                <Menubar className="border-0 h-5 w-[24px] cursor-pointer">
                                    <MenubarMenu className="border-0 cursor-pointer ">
                                        <MenubarTrigger>
                                            <Blocks className="cursor-pointer mt-1" />
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <Link href="/admin/dashboard">
                                                <MenubarItem className="px-1">
                                                    <ShieldHalf className="text-[#9a9696]" />
                                                    <span className="px-3">
                                                        admin
                                                    </span>
                                                </MenubarItem>
                                            </Link>
                                            <MenubarSeparator />
                                            <Link href="/employee/dashboard">
                                                <MenubarItem className="px-1">
                                                    <User className="text-[#9a9696]" />
                                                    <span className="px-3">
                                                        employee
                                                    </span>
                                                </MenubarItem>
                                            </Link>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            ) : (
                                <Link href="/employee/dashboard">
                                    <Blocks className="cursor-pointer" />
                                </Link>
                            )}
                        </li>

                        <li
                            className={`relative hover:text-[#3354F4] cursor-pointer ${
                                pathname == "/"
                                    ? "text-[#3354F4]"
                                    : "text-[#A3AED0]"
                            }`}
                        >
                            <Link href="/">
                                {pathname == "/" && JSXspan}

                                <MessageSquareText />
                            </Link>
                        </li>
                        {isAdmin && (
                            <>
                                {" "}
                                <li
                                    className={`relative hover:text-[#3354F4] cursor-pointer ${
                                        pathname == "/admin/manageEmployees"
                                            ? "text-[#3354F4]"
                                            : "text-[#A3AED0]"
                                    }`}
                                >
                                    <Link href="/admin/manageEmployees">
                                        {pathname == "/admin/manageEmployees" &&
                                            JSXspan}

                                        <Users />
                                    </Link>
                                </li>
                                <li
                                    className={`relative hover:text-[#3354F4] cursor-pointer ${
                                        pathname == "/admin/"
                                            ? "text-[#3354F4]"
                                            : "text-[#A3AED0]"
                                    }`}
                                >
                                    <Link href="/employee/test">
                                        {pathname == "/employee/test" &&
                                            JSXspan}

                                        <UserPlus />
                                    </Link>
                                </li>
                            </>
                        )}
                        <li
                            className={`relative hover:text-[#3354F4] cursor-pointer ${
                                pathname ==
                                ("/employee/attendance" || "/admin/attendance")
                                    ? "text-[#3354F4]"
                                    : "text-[#A3AED0]"
                            }`}
                        >
                            <Link href="/employee/attendance">
                                {pathname ==
                                    ("/employee/attendance" ||
                                        "/admin/attendance") && JSXspan}
                                <History />
                            </Link>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}
