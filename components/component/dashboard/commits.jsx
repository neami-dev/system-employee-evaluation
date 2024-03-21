"use client";
import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import React, { useEffect, useState } from "react";
import ChangingProgressProvider from "../ChangingProgressProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Commits() {
    const [commits, setCommits] = useState(undefined);
   useEffect(()=>{
    getTotalCommitsForToday().then((res) => {
        setCommits(res);
    });
   },[])
    return (
        <div>
            {commits !== undefined ? (
                <>
                    <div className="w-[65px]">
                        <ChangingProgressProvider
                            values={[0, 30]}
                        >
                            {(percentage) => (
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${commits}/3`}
                                    styles={buildStyles({
                                        pathTransition:
                                            percentage === 0
                                                ? "none"
                                                : "stroke-dashoffset 0.5s ease 0s",
                                        pathColor: "#3354F4",
                                    })}
                                />
                            )}
                        </ChangingProgressProvider>
                    </div>
                    <p>Commits</p>
                </>
            ) : (
                <div className="flex items-center">
                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                    <div className="">
                        <Skeleton className="h-3 w-[120px] mt-2" />
                    </div>
                </div>
            )}
        </div>
    );
}
