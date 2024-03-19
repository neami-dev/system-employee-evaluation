"use client";
import { Sun } from "lucide-react";
import CurrentTime from "./currentTime";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Weather() {
    return (
        <>
            <div>
                <ul className=" bg-white w-full h-[100%] flex flex-col gap-8 py-8 rounded-lg justify-center items-center">
                    <li className="flex  justify-center items-center text-[#C8CAD5]">
                        <Sun size={52} strokeWidth={1.8} />

                        <div className="flex flex-col ml-2">
                            <span>
                                <CurrentTime />
                            </span>
                            <span>Realtime Insight</span>
                        </div>
                    </li>
                    <li className="flex flex-col font-medium text-[#6f7071]">
                        <span>Today : </span>
                        <span>{new Date().toDateString()}</span>
                    </li>
                    <li>
                        <Link href="/employee/attendance">
                            <Button className="bg-[#3353f4c6] font-normal text-lg hover:bg-[#3354F4]">
                                view attendance
                            </Button>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}
