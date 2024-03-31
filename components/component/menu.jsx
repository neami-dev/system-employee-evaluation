"use client";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
// import {
//     Menubar,
//     MenubarCheckboxItem,
//     MenubarContent,
//     MenubarItem,
//     MenubarMenu,
//     MenubarRadioGroup,
//     MenubarRadioItem,
//     MenubarSeparator,
//     MenubarShortcut,
//     MenubarSub,
//     MenubarSubContent,
//     MenubarSubTrigger,
//     MenubarTrigger,
//   } from "@/components/ui/menubar"
import {
    Blocks,
    MessageSquareText,
    UserPlus,
    History,
    Users,
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
        // const interVal = setInterval(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIslogged(true);
                const response = await checkRoleAdmin(user.uid);
                setIsAdmin(response?.result);
            } else {
                route.push("/login");
            }
        });
        // }, 1000);
        // return () => clearInterval(interVal);
    }, []);

    const JSXspan = (
        <span className="before:absolute before:h-10   before:w-[6px]  before:bg-[#3354F4] before:left-[-21px]  before:top-[-8px]  before:rounded-r-lg menu-line "></span>
    );
    if (isLogged) {
        return (
            <>
                <div className=" menu fixed w-10  z-10 top-36 left-[4%] max-[865px]:left-[2%] max-[425px]:w-[100%]">
                    <ul className="bg-white text-[#A3AED0] rounded-xl flex flex-wrap  gap-8 flex-col max-[425px]:flex-row justify-around items-center  w-[68px] max-[425px]:w-[100%]  max-[425px]:rounded-b-none py-5 max-[425px]:py-3 max-[425px]:px-5 shadow-[0_8px_28px_0px_#4859660D]">
                        {/* <li>
                    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      </Menubar>

                    </li> */}
                        <li
                            className={`relative hover:text-[#3354F4]  cursor-pointer ${
                                pathname ==
                                ("/employee/dashboard" || "/admin/dashboard")
                                    ? "text-[#3354F4]"
                                    : "text-[#A3AED0]"
                            }`}
                        >
                            {isAdmin ? (
                                <Select>
                                    <SelectTrigger className=" border-none w-6 hover:outline-none ">
                                        {pathname ==
                                            ("/employee/dashboard" ||
                                                "/admin/dashboard") && JSXspan}

                                        <Blocks className=" absolute left-[3px] top-[5px]" />
                                    </SelectTrigger>
                                    <SelectContent className="flex justify-center absolute left-[40px] top-[-50px]">
                                        <div className="text-center text-[#767d8e] hover:text-[#4c4a4a]">
                                            <Link href="/admin/dashboard">
                                                Admin
                                            </Link>
                                        </div>
                                        <hr />
                                        <div className="text-center text-[#767d8e] hover:text-[#4c4a4a]">
                                            <Link href="/employee/dashboard">
                                                Employee
                                            </Link>
                                        </div>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Link href="/employee/dashboard">
                                    <Blocks className=" absolute left-[3px] top-[5px]" />
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
