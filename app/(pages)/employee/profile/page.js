"use client";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ResponsiveAreaBump, ResponsiveBump } from "@nivo/bump";

import Link from "next/link";
import { useRouter } from "next/navigation";
import getDocument from "@/firebase/firestore/getDocument";
import {
    getAuthenticatedUserDetails,
    getCompletedTasksByEmployee,
    getCompletedTasksByEmployeeToday,
    getFolders,
    getInProgressTasksByEmployee,
    getListsInSpace,
    getPendingTasksByEmployee,
    getSpaces,
    getTasks,
    getTeams,
} from "@/app/api/actions/clickupActions";
import { auth } from "@/firebase/firebase-config";
import NavBar from "@/components/component/NavBar";
import Menu from "@/components/component/menu";
import { Footer } from "react-day-picker";
import {
    getAllUserIds,
    getClockifyUserData,
    getClockifyWorkSpaces,
    getTimeTrackedByEmployeeToday,
} from "@/app/api/actions/clockifyActions";
import {
    Blocks,
    History,
    MessageSquareText,
    UserPlus,
    Users,
} from "lucide-react";
import Components from "@/components/component/components";
import Weather from "@/components/component/weather";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import CurvedlineChart from "@/components/component/curvedLineChart";
import BarChart from "@/components/component/barChart";

export default function page() {
    const [userData, setUserData] = useState();
    const [data, setData] = useState({});
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksPending, setTasksPending] = useState([]);

    const route = useRouter();
    const infoDoc = { collectionName: "userData", id: data?.uid };

    // get info the user score department ...
    const getInfo = async () => {
        if (infoDoc.id !== undefined && infoDoc.collectionName !== undefined) {
            const result = await getDocument(
                infoDoc.collectionName,
                infoDoc.id
            );
            setUserData(result.result.data());
            console.log(result.result.data());
        }

        const team = await getTeams();
        console.log("team : ", team);

        //     const space = await getSpaces(team?.id);
        //     console.log('space : ',space);

        //     const folder = await getFolders(space[0]?.id);
        //     console.log('folder : ',folder);

        //     const list = await getListsInSpace(space[0]?.id);
        //     console.log('list : ',list);

        //     const task = await getTasks(list[0]?.id);
        //     console.log('task : ',task);

        const userCickupDetails = await getAuthenticatedUserDetails();
        console.log("userCickupDetails : ", userCickupDetails);

        const responseTasksCompleted = await getCompletedTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksCompleted(responseTasksCompleted);
        console.log("tasksCompleted : ", responseTasksCompleted);

        const responseTasksProgress = await getInProgressTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksInProgress(responseTasksProgress);
        console.log("tasksProgress : ", responseTasksProgress);

        const responseTasksPending = await getPendingTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksPending(responseTasksPending);
        console.log("tasksPending : ", responseTasksPending);

        const ClockifyUserData = await getClockifyUserData();
        console.log("ClockifyUserData : ", ClockifyUserData);

        const ClockifyWorkSpaces = await getClockifyWorkSpaces();
        console.log("ClockifyWorkSpaces : ", ClockifyWorkSpaces);

        const TimeTrackedByEmployeeToday = await getTimeTrackedByEmployeeToday(
            ClockifyUserData?.id,
            ClockifyWorkSpaces?.id
        );
        console.log(
            "TimeTrackedByEmployeeToday : ",
            TimeTrackedByEmployeeToday
        );

        const AllUserIds = await getAllUserIds(ClockifyWorkSpaces?.id);
        console.log("AllUserIds : ", AllUserIds);
    };

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setData(user);
            } else {
                // Redirect if not authenticated
                route.push("/login");
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []); // Removed data from dependencies to avoid re-triggering

    useEffect(() => {
        if (infoDoc.id && infoDoc.collectionName) {
            getInfo();
        }
    }, [infoDoc.id, infoDoc.collectionName]);
    console.log("userData:", userData);
    const itemStyle =
        "bg-white rounded-lg w-[230px] h-[115px] flex items-center justify-evenly ";
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
    return (
        <>
            <section className=" grid justify-center w-full mx-auto  pt-32">
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                    <li className="w-[230px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                        <Weather />
                    </li>
                    <li className={`${itemStyle} `}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 90]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`${tasksCompleted?.length} TASK`}
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
                    </li>
                    <li className={`${itemStyle}`}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 80]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={"kkk"}
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
                    </li>
                    <li className={`${itemStyle}`}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 50]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`04/07`}
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
                    </li>
                    <li className={`${itemStyle}`}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 30]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`04/07`}
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
                    </li>
                    <li className={`${itemStyle}`}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 20]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`04/07`}
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
                    </li>
                    <li className={`${itemStyle}`}>
                        <div className="w-[65px]">
                            <ChangingProgressProvider values={[0, 36]}>
                                {(percentage) => (
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`04/07`}
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
                        <p>Work Time</p>
                    </li>
                </ul>
            </section>
            <section>
                <div className="flex w-full flex-wrap gap-6 mt-4 xl:px-8">
                    <CurvedlineChart
                        data={dataChart}
                        className="w-full sm:w-[70%] lg:w-[46%]  xl:w-[56%] mx-auto  h-[300px] bg-white rounded-lg"
                    />

                    <BarChart
                        className="w-full sm:w-[70%] lg:w-[46%]   mx-auto xl:w-[40%]  h-[300px] bg-white rounded-lg"
                        data={chartBarData}
                    />
                </div>
            </section>
        </>
    );
}
