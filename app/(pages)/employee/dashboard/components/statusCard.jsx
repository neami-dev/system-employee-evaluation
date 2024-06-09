"use client";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export default function StatusCard({ text, style, percent, countAll, count }) {
    
    return (
        <>
            {countAll !== null && count !== null ? (
                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                    <div className="w-[65px]">
                        <ChangingProgressProvider values={[0, percent]}>
                            {(percentage) => (
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${count}/${countAll}`}
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
                    <p> {text}</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly "  >
                    
                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                    <div className="">
                        <Skeleton className="h-3 w-[120px] mt-2" />
                    </div>
                </div>
            )}
        </>
    );
}
