"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { useRouter } from "next/navigation";

import {
    getAllTasksByEmployee,
    getCompletedTasksByEmployee,
    getInProgressTasksByEmployee,
    getOpenTasksByEmployee,
    getPendingTasksByEmployee,
} from "@/app/api/actions/clickupActions";
import { auth } from "@/firebase/firebase-config";

import {
    getClockifyUserData,
    getClockifyWorkSpaces,
    getTimeTrackedByEmployeeToday,
} from "@/app/api/actions/clockifyActions";
import { AlignCenter } from "lucide-react";

import Weather from "@/components/component/weather";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";

import CurvedlineChart from "@/components/component/curvedLineChart";
import BarChart from "@/components/component/barChart";
import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import { Skeleton } from "@/components/ui/skeleton";
import updateDocument from "@/firebase/firestore/updateDocument";
import getDocument from "@/firebase/firestore/getDocument";
import { firebaseWithGithub } from "@/dataManagement/firebaseWithGithub";



export default function page() {
    const [userData, setUserData] = useState();
    const [data, setData] = useState({});
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksPending, setTasksPending] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [tasksOnHold, setTasksOnHold] = useState([]);
    const [commits, setCommits] = useState();
    const [timeTrackedByEmployeeToday, setTimeTrackedByEmployeeToday] =
        useState({});
    const route = useRouter();
   
    useEffect(() => {
      const interval =  setInterval(() => {
        auth.onAuthStateChanged((user) => {
            firebaseWithGithub(setCommits,user?.uid);
        });
       }, 4000);
       return ()=>{clearInterval(interval)} 
    }, []);
    // get info the user score department ...
    const getInfo = async () => {
        
        console.log("data", data);
        // if (id !== undefined) {
        //     const response = await getDocument("userData", id);
        //     const totalCommits = response.result.data()?.commits;
        //     setCommits(totalCommits)
        //     console.log("totalCommits",totalCommits);
        // }

        // const [team, userCickupDetails] = await Promise.all([
        //     getTeams(),
        //     getAuthenticatedUserDetails(),
        // ]);
        // console.log("=====1", userCickupDetails?.id);
        const teamId = "9015373700";
        const userId = "62619802";

        const [
            responseAllTasks,
            responseTasksCompleted,
            responseTasksProgress,
            responseTasksOpen,
            responseTasksPending,
        ] = await Promise.all([
            getAllTasksByEmployee(teamId, userId),
            getCompletedTasksByEmployee(teamId, userId),
            getInProgressTasksByEmployee(teamId, userId),
            getOpenTasksByEmployee(teamId, userId),
            getPendingTasksByEmployee(teamId, userId),
        ]);
        console.log("====2", responseAllTasks, responseTasksCompleted);

        setAllTasks(responseAllTasks);
        setTasksCompleted(responseTasksCompleted);

        setTasksInProgress(responseTasksProgress);

        setTasksOnHold(responseTasksOpen);

        setTasksPending(responseTasksPending);
        console.log("2");

        const [ClockifyUserData, ClockifyWorkSpaces] = await Promise.all([
            getClockifyUserData(),
            getClockifyWorkSpaces(),
        ]);
        const resTimeTrackedByEmployeeToday =
            await getTimeTrackedByEmployeeToday(
                ClockifyUserData?.id,
                ClockifyWorkSpaces?.id
            );
        setTimeTrackedByEmployeeToday(resTimeTrackedByEmployeeToday);

        // const GithubTotalCommits = await getTotalCommitsForToday();
        // setCommits(GithubTotalCommits);
    };

    useEffect(() => {
        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                // setData(user);
            } else {
                // Redirect if not authenticated
                route.push("/login");
            }
        });

        // Cleanup subscription on component unmount
        // return () => unsubscribe();
    }, []); // Removed data from dependencies to avoid re-triggering

    useEffect(() => {
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
        if (allTasks?.length > 0) {
            return {
                tasksInProgress: Math.round(
                    (tasksInProgress?.length * 100) / allTasks?.length
                ),
                tasksPending: Math.round(
                    (tasksPending?.length * 100) / allTasks?.length
                ),
                tasksCompleted: Math.round(
                    (tasksCompleted?.length * 100) / allTasks?.length
                ),

                tasksOnHold: Math.round(
                    (tasksOnHold?.length * 100) / allTasks?.length
                ),
            };
        }
    };
    const progressPercentageCommits = () => {
        if (commits !== undefined) {
            return Math.round((commits * 100) / 3);
        }
    };
    const progressPercentageTimeWork = () => {
        if (timeTrackedByEmployeeToday !== undefined) {
            return Math.round((timeTrackedByEmployeeToday?.hours * 100) / 8);
        }
    };
    const itemStyle =
        "bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ";
    return (
        <>
            <section className=" grid justify-center w-full mx-auto  pt-32">
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                    <li className="w-[260px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                        <Weather />
                    </li>
                    <li className={`${itemStyle} `}>
                        {allTasks?.length > 0 ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentageTask()
                                                .tasksCompleted,
                                        ]}
                                    >
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${tasksCompleted?.length}/${allTasks?.length}`}
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
                        {allTasks?.length > 0 ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentageTask()
                                                .tasksInProgress,
                                        ]}
                                    >
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${tasksInProgress?.length}/${allTasks?.length}`}
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
                        {allTasks?.length > 0 ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentageTask()
                                                .tasksOnHold,
                                        ]}
                                    >
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                responseTasksOnHold
                                                text={`${tasksOnHold?.length}/${allTasks?.length}`}
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
                        {allTasks?.length > 0 ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentageTask()
                                                .tasksPending,
                                        ]}
                                    >
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${tasksPending.length}/${allTasks?.length}`}
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
                        {timeTrackedByEmployeeToday?.hours !== undefined ? (
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
                                                text={`${timeTrackedByEmployeeToday?.hours}/8H`}
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
                        {commits !== undefined ? (
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
                <div className="flex w-full flex-wrap gap-4 mt-8 xl:px-8">
                    <div className="w-full sm:w-[70%] lg:w-[52%]  xl:w-[56%] mx-auto h-[350px] p-3  bg-white rounded-lg">
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

                    <div className="w-full sm:w-[70%] lg:w-[42%]   mx-auto xl:w-[40%] h-[350px] p-3 bg-white rounded-lg">
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
}
