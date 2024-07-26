"use client";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import classNames from "classnames";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export default function StatusCard({ text, children, count, color }) {
    const textColorClass = `text-[${color}]`;

    return (
        <>
            {count !== null && (
                <li className="bg-white rounded-lg w-[260px] h-[115px] flex flex-col   justify-evenly">
                    <div className="flex justify-between px-5 w-full ">
                        <span style={{ color: color }} className=" text-4xl ">{count}</span>
                        <span
                            style={{ color: color }}
                            className=" bg-[#E6EAF5] p-2 rounded-full"
                        >
                            {children}
                        </span>
                    </div>
                    <h3
                        style={{ color: color }}
                        className={` font-medium ml-5 text-lg`}
                    >
                        {text}
                    </h3>
                </li>
            ) }
        </>
    );
}
