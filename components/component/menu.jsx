"use client";
import { auth } from "@/firebase/firebase-config";
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "../ui/use-toast";
import { checkDataExistsInFirebase } from "@/app/api_services/actions/ckeckDbAndCookies";
import { getCookie } from "cookies-next";
import {
    addCookie,
    checkCookies,
} from "@/app/api_services/actions/handleCookies";
import Loading from "./Loading";

export default function Menu() {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(getCookie("isAdmin") || false);
    const [isLogged, setIsLogged] = useState(false);
    const route = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // check if user logged 
                addCookie("isLogged", false);
                return false;
            }
            addCookie("isLogged", true);
            setIsLogged(true);
            // check if user is email verified
            console.log("emailVerified", user?.emailVerified);
            if (user?.emailVerified !== true) {
                route.push("/invalid-email");
                return false;
            }
            // check cookies if exists 
            await checkCookies(user?.uid);
            // check if any data lacked (clickup github cloockify)
            const checkResponse = await checkDataExistsInFirebase();
             
            console.log(checkResponse);
            console.log(!!checkResponse?.link);
            if (!!checkResponse?.link) route.push(checkResponse?.link);
            if (!!checkResponse?.errorMsg) {
                toast({
                    description: checkResponse?.errorMsg,
                    variant: "destructive",
                });
            }
            // check if user is admin
            const response = await checkRoleAdmin(user.uid);
            setIsAdmin(response?.result);
            console.log("isAdmin", response?.result);
            addCookie("isAdmin", response?.result);
            
        
            
            
        });
    }, []);
console.log("env:",process.env.NEXT_PUBLIC_BASE_URL);
    const JSXspan = (
        <span className="before:absolute before:h-10   before:w-[6px]  before:bg-[#3354F4] before:left-[-21px]  before:top-[-8px]  before:rounded-r-lg menu-line "></span>
    );
    if (isLogged == true) {
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
                            {String(isAdmin)?.toLowerCase() === "true" ? (
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
                            <Link href="/chat">
                                {pathname == "/chat" && JSXspan}

                                <MessageSquareText />
                            </Link>
                        </li>
                        {/*  the cookies type string */}
                        {String(isAdmin)?.toLowerCase() === "true" && (
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
                            </>
                        )}
                        <li
                            className={`relative hover:text-[#3354F4]  cursor-pointer ${
                                pathname === "/employee/attendance" ||
                                pathname === "/admin/attendance"
                                    ? "text-[#3354F4]"
                                    : "text-[#A3AED0]"
                            }`}
                        >
                            {pathname === "/employee/attendance" ||
                            pathname === "/admin/attendance"
                                ? JSXspan
                                : null}
                            {String(isAdmin)?.toLowerCase() === "true" ? (
                                <Menubar className="border-0 h-5 w-[24px] cursor-pointer">
                                    <MenubarMenu className="border-0 cursor-pointer ">
                                        <MenubarTrigger>
                                            <History className="cursor-pointer mt-1" />
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <Link href="/admin/attendance">
                                                <MenubarItem className="px-1">
                                                    <ShieldHalf className="text-[#9a9696]" />
                                                    <span className="px-3">
                                                        admin
                                                    </span>
                                                </MenubarItem>
                                            </Link>
                                            <MenubarSeparator />
                                            <Link href="/employee/attendance">
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
                                <Link href="/employee/attendance">
                                    <History className="cursor-pointer" />
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </>
        );
    } else {
        <Loading />;
    }
}
