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
    getAllTasksByEmployee,
    getAuthenticatedUserDetails,
    getCompletedTasksByEmployee,
    getCompletedTasksByEmployeeToday,
    getFolders,
    getInProgressTasksByEmployee,
    getListsInSpace,
    getOnHoldTasksByEmployee,
    getOpenTasksByEmployee,
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
    AlignCenter,
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
import {
    getGitHubUserRepos,
    getGitHubUsername,
    getGithubCommitsForToday,
    getTotalCommitsForToday,
} from "@/app/api/actions/githubActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function page() {
    const [userData, setUserData] = useState();
    const [data, setData] = useState({});
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksPending, setTasksPending] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [tasksOnHold, setTasksOnHold] = useState([]);
    const [githubTotalCommits, setGithubTotalCommits] = useState(null);

    const route = useRouter();
    const infoDoc = { collectionName: "userData", id: data?.uid };

    const getInfoOfGithub = async () => {
        // const GithubUsername = await getGitHubUsername()
        // console.log('GitHub Username:', GithubUsername);

        // const GithubRepos = await getGitHubUserRepos()
        // console.log('User Repositories:', GithubRepos);

        const responseGithubTotalCommits = await getTotalCommitsForToday();
        console.log("total of Commits made today:", responseGithubTotalCommits);
        setGithubTotalCommits(responseGithubTotalCommits);
    };

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

        const responseAllTasks = await getAllTasksByEmployee(
            team.id,
            userCickupDetails.id
        );
        console.log("allTasks : ", responseAllTasks);
        setAllTasks(responseAllTasks);

        const responseTasksCompleted = await getCompletedTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksCompleted(responseTasksCompleted);
        // console.log("tasksCompleted : ", responseTasksCompleted);

        const responseTasksProgress = await getInProgressTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksInProgress(responseTasksProgress);
        console.log("tasksProgress : ", responseTasksProgress);

        const responseTasksOpen = await getOpenTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksOnHold(responseTasksOpen);
        console.log("tasksOpen : ", responseTasksOpen);

        const responseTasksPending = await getPendingTasksByEmployee(
            team?.id,
            userCickupDetails?.id
        );
        setTasksPending(responseTasksPending);
        console.log("tasksPending : ", responseTasksPending);
        // const responseAllTasksByEmployee = await getAllTasksByEmployee(
        //     userCickupDetails?.id,
        //     team?.id
        // );
        // console.log("all", responseAllTasksByEmployee);

        const ClockifyUserData = await getClockifyUserData();
        // console.log("ClockifyUserData : ", ClockifyUserData);

        const ClockifyWorkSpaces = await getClockifyWorkSpaces();
        // console.log("ClockifyWorkSpaces : ", ClockifyWorkSpaces);

        const TimeTrackedByEmployeeToday = await getTimeTrackedByEmployeeToday(
            ClockifyUserData?.id,
            ClockifyWorkSpaces?.id
        );
        // console.log(
        //     "TimeTrackedByEmployeeToday : ",
        //     TimeTrackedByEmployeeToday
        // );

        const AllUserIds = await getAllUserIds(ClockifyWorkSpaces?.id);
        // console.log("AllUserIds : ", AllUserIds);
    };
    useEffect(() => {
        getInfoOfGithub();
    }, []);
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
    // console.log("userData:", userData);
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

    const progressPercentage = () => {
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
                githubTotalCommits: Math.round((githubTotalCommits * 100) / 3),
            };
        }
    };
    console.log(progressPercentage()?.githubTotalCommits);
    return (
        <>
            <section className=" grid justify-center w-full mx-auto  pt-32">
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                    <li className="w-[230px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                        <Weather />
                    </li>
                    <li className={`${itemStyle} `}>
                        {allTasks?.length > 0 ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentage().tasksCompleted,
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
                                            progressPercentage()
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
                                            progressPercentage().tasksOnHold,
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
                                            progressPercentage().tasksPending,
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
                        {true ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider values={[0, 20]}>
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`04/${allTasks?.length}`}
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
                        {githubTotalCommits !== null ? (
                            <>
                                <div className="w-[65px]">
                                    <ChangingProgressProvider
                                        values={[
                                            0,
                                            progressPercentage()
                                                ?.githubTotalCommits,
                                        ]}
                                    >
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${githubTotalCommits}/03`}
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
                <div className="flex w-full flex-wrap gap-4 mt-4 xl:px-8">
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
