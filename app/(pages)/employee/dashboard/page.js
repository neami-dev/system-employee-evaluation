"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import {
    getAllTasksByEmployee,
    getAuthenticatedUserDetails,
    getCompletedTasksByEmployee,
    getHoldTasksByEmployee,
    getInProgressTasksByEmployee,
    getOpenTasksByEmployee,
    getPendingTasksByEmployee,
    getTeams,
} from "@/app/api_services/actions/clickupActions";
import { auth } from "@/firebase/firebase-config";

import { AlignCenter } from "lucide-react";
import Weather from "@/components/component/weather";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";
import CurvedlineChart from "@/components/component/curvedLineChart";
import BarChart from "@/components/component/barChart";
import { Skeleton } from "@/components/ui/skeleton";

import { onAuthStateChanged } from "firebase/auth";
import { getTotalCommitsForToday } from "@/app/api_services/actions/githubActions";
import { getTimeTrackedByEmployeeToday } from "@/app/api_services/actions/clockifyActions";

import { getCookie } from "cookies-next";
import Loading from "@/components/component/Loading";

export default function page() {
    const [tasksCompleted, setTasksCompleted] = useState(
        getCookie("tasksCompleted") || null
    );
    const [tasksInProgress, setTasksInProgress] = useState(
        getCookie("tasksProgress") || null
    );
    const [tasksPending, setTasksPending] = useState(
        getCookie("tasksPending") || null
    );
    const [allTasks, setAllTasks] = useState(getCookie("tasks") || null);
    const [tasksOnHold, setTasksOnHold] = useState(
        getCookie("tasksHold") || null
    );
    const [commits, setCommits] = useState(getCookie("totalCommits") || null);
    const [isLogged, setIsLogged] = useState(false);
    const [timeTrackedByEmployeeToday, setTimeTrackedByEmployeeToday] =
        useState(getCookie("workTime") || null);

    const route = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLogged(true);
            } else {
                route.push("/login");
                console.log("logout from dashboard employee");
            }
        });
        const getInfo = async () => {
            try {
                await getTimeTrackedByEmployeeToday(
                    getCookie("clockifyUserId"),
                    getCookie("clockifyWorkspace")
                );
                setTimeTrackedByEmployeeToday(getCookie("workTime"));

                await getTotalCommitsForToday();
                setCommits(getCookie("totalCommits"));

                // function to get information from clickUp
                const [team, userCickupDetails] = await Promise.all([
                    getTeams(),
                    getAuthenticatedUserDetails(),
                ]);
                await getOpenTasksByEmployee(team?.id, userCickupDetails?.id);
                await getCompletedTasksByEmployee(
                    team?.id,
                    userCickupDetails?.id
                );
                setTasksCompleted(getCookie("tasksCompleted"));
                await getInProgressTasksByEmployee(
                    team?.id,
                    userCickupDetails?.id
                );
                setTasksInProgress(getCookie("tasksProgress"));
                await getPendingTasksByEmployee(
                    team?.id,
                    userCickupDetails?.id
                );
                setTasksPending(getCookie("tasksPending"));
                await getHoldTasksByEmployee(team?.id, userCickupDetails?.id);
                setTasksOnHold(getCookie("tasksHold"));
                await getAllTasksByEmployee(team?.id, userCickupDetails?.id);
                setAllTasks(getCookie("tasks"));
            } catch (error) {
                console.log("error from dashboard", error.message);
            }
        };
        getInfo();
    }, []);

    const dataChart = [
        {
            id: "",
            data: [
                { x: "Jan", y: 49 },
                { x: "Feb", y: 137 },
                { x: "Mar", y: 61 },
                { x: "Apr", y: 145 },
                { x: "May", y: 26 },
                { x: "Jun", y: 154 },
            ],
        },
    ];
    const chartBarData = [
        { name: "Jan", count: 111 },
        { name: "Feb", count: 157 },
        { name: "Mar", count: 129 },
        { name: "Apr", count: 150 },
        { name: "May", count: 119 },
        { name: "Jun", count: 72 },
    ];

    const progressPercentageTask = () => {
        if (allTasks !== null) {
            return {
                tasksInProgress: Math.round((tasksInProgress * 100) / allTasks),
                tasksPending: Math.round((tasksPending * 100) / allTasks),
                tasksCompleted: Math.round((tasksCompleted * 100) / allTasks),
                tasksOnHold: Math.round((tasksOnHold * 100) / allTasks),
            };
        }
    };
    const progressPercentageCommits = () => {
        if (commits !== null) {
            return Math.round((commits * 100) / 3);
        }
    };
    const progressPercentageTimeWork = () => {
        if (timeTrackedByEmployeeToday !== null) {
            return Math.round((timeTrackedByEmployeeToday * 100) / 8);
        }
    };
    const itemStyle =
        "bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ";
    if (isLogged === true) {
        return (
            <>
                <section className="grid justify-center w-full mx-auto pt-32">
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:ml-[80px] lg:grid-cols-3 xl:grid-cols-4 ">
                        <li className="w-[260px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                            <Weather />
                        </li>
                        <li className={`${itemStyle} `}>
                            {allTasks !== null && tasksCompleted !==null ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageTask()
                                                    ?.tasksCompleted,
                                            ]}
                                        >
                                            {(percentage) => (
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${tasksCompleted}/${allTasks}`}
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
                                    <p>Tasks Completed</p>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                                    <div className="">
                                        <Skeleton className="h-3 w-[120px] mt-2" />
                                    </div>
                                </div>
                            )}
                        </li>
                        <li className={`${itemStyle}`}>
                            {allTasks !== null && tasksInProgress !==null ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageTask()
                                                    ?.tasksInProgress,
                                            ]}
                                        >
                                            {(percentage) => (
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${tasksInProgress}/${allTasks}`}
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
                                    <p> Tasks in Progress</p>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                                    <div className="">
                                        <Skeleton className="h-3 w-[120px] mt-2" />
                                    </div>
                                </div>
                            )}
                        </li>
                        <li className={`${itemStyle}`}>
                            {allTasks !== null && tasksOnHold !==null  ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageTask()
                                                    ?.tasksOnHold,
                                            ]}
                                        >
                                            {(percentage) => (
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${tasksOnHold}/${allTasks}`}
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
                                    <p> Tasks On Hold</p>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                                    <div className="">
                                        <Skeleton className="h-3 w-[120px] mt-2" />
                                    </div>
                                </div>
                            )}
                        </li>
                        <li className={`${itemStyle}`}>
                            {allTasks !== null && tasksPending !==null ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageTask()
                                                    ?.tasksPending,
                                            ]}
                                        >
                                            {(percentage) => (
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${tasksPending}/${allTasks}`}
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
                                    <p> tasks Pending</p>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                                    <div className="">
                                        <Skeleton className="h-3 w-[120px] mt-2" />
                                    </div>
                                </div>
                            )}
                        </li>
                        <li className={`${itemStyle}`}>
                            {timeTrackedByEmployeeToday !== null ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageTimeWork(),
                                            ]}
                                        >
                                            {(percentage) => (
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${timeTrackedByEmployeeToday}/8H`}
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
                                    <p> Work Time</p>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-full mr-1" />
                                    <div className="">
                                        <Skeleton className="h-3 w-[120px] mt-2" />
                                    </div>
                                </div>
                            )}
                        </li>
                        <li className={`${itemStyle}`}>
                            {commits !== null ? (
                                <>
                                    <div className="w-[65px]">
                                        <ChangingProgressProvider
                                            values={[
                                                0,
                                                progressPercentageCommits(),
                                            ]}
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
                        </li>
                    </ul>
                </section>
                <section>
                    <div className="flex w-full flex-wrap gap-4 lg:w-[86%] lg:ml-[106px] xl:w-[86%]  mt-8 xl:px-8 xl:ml-[135px]">
                        <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[52%]  xl:w-[56%] mx-auto h-[350px] p-3  bg-white rounded-lg">
                            <ul className="flex justify-between items-center ">
                                <li>General performance</li>
                                <li></li>
                                <li> </li>

                                <li>
                                    <AlignCenter className=" cursor-pointer text-slate-700" />
                                </li>
                            </ul>

                            <CurvedlineChart data={dataChart} />
                        </div>

                        <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[42%]   mx-auto xl:w-[40%] h-[350px] p-3 bg-white rounded-lg">
                            <ul className="flex justify-between items-center">
                                <li>Statistics</li>
                                <li>
                                    <AlignCenter className=" cursor-pointer text-slate-700" />
                                </li>
                            </ul>
                            <BarChart data={chartBarData} />
                        </div>
                    </div>
                </section>
            </>
        );
    } else {
        return <Loading />;
    }
}
