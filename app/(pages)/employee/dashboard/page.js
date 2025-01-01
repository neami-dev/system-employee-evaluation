"use client";

import React, { Suspense, useEffect, useState } from "react";

import "react-circular-progressbar/dist/styles.css";
import {
    getAllTasksByEmployee,
    getTaskById,
} from "@/app/api_services/actions/clickupActions";
import { auth } from "@/firebase/firebase-config";

import { AlignCenter } from "lucide-react";
import Weather from "@/components/component/weather";

import BarChart from "@/components/component/barChart";

import { getTotalCommitsForToday } from "@/app/api_services/actions/githubActions";
import { getTimeTrackedByEmployeeToday } from "@/app/api_services/actions/clockifyActions";

import { getCookie } from "cookies-next";
import Loading from "@/components/component/Loading";
import getDocument from "@/firebase/firestore/getDocument";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";

import { onAuthStateChanged } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatusCard from "@/components/component/statusCard";

export default function page() {
    const [tasksGroupedByStatus, setTasksGroupedByStatus] = useState([]);
    const [commits, setCommits] = useState(null);
    const [timeTrackedByEmployeeToday, setTimeTrackedByEmployeeToday] =
        useState(null);

    const [dataAtter, setDataAtter] = useState([]);
    const [dataMethodologyOfWork, setDataMethodologyOfWork] = useState([]);
    const [slectedTypeBar, setSlectedTypeBar] = useState("weekly");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getInfo(user?.uid);
                const data = await getEvaluation(user?.uid);
                if (
                    data?.methodologyOfWork !== null &&
                    data?.methodologyOfWork !== undefined
                ) {
                    handleChartLineMethodologyOfWork(data?.methodologyOfWork);
                }
            }
        });
    }, []);
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getInfo(user?.uid);
                const data = await getEvaluation(user?.uid);

                if (
                    data?.attributes !== null &&
                    data?.attributes !== undefined
                ) {
                    handleChartBarAtter(data?.attributes);
                }
            }
        });
    }, [slectedTypeBar]);
    const getEvaluation = async (uid) => {
        const response = await getDocument("evaluation", uid);
        const data = response?.result?.data();
        return data;
    };
    const getInfo = async (uid) => {
        try {
            const response = await getDocument("userData", uid);

            const clickupTeam = response?.result?.data()?.clickupTeam;
            const clickupUser = response?.result?.data()?.clickupUser;
            const clockifyUserId = response?.result?.data()?.clockifyUserId;
            const clockifyWorkspace =
                response?.result?.data()?.clockifyWorkspace;
            const allTasks = await getAllTasksByEmployee(
                clickupTeam,
                clickupUser
            );
            console.log("all tasks", allTasks);
            const groupTasksBystatus = (tasks) => {
                return tasks.reduce((acc, task) => {
                    const status = task?.status?.status;
                    if (!acc[status]) {
                        acc[status] = [];
                    }
                    acc[status].push(task);
                    return acc;
                }, {});
            };
            const groupedTasks = groupTasksBystatus(allTasks || []);
            setTasksGroupedByStatus(Object.entries(groupedTasks));

            // function to get information from clickUp
            const workTime = await getTimeTrackedByEmployeeToday(
                clockifyUserId,
                clockifyWorkspace
            );
            console.log("workTime",workTime);
            
            const totalCommits = await getTotalCommitsForToday();

            setTimeTrackedByEmployeeToday(workTime?.value?.hours);
            console.log("totalCommits", totalCommits);
            setCommits(totalCommits?.value);
        } catch (error) {
            console.log("error from dashboard", error.message);
        }
    };
    const handleChartBarAtter = async (data) => {
        const dataArray = Object.entries(data).map(([date, value]) => ({
            date: new Date(date),
            value,
        }));

        const getWeekNumber = (date) => {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;

            return Math.ceil(
                (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
            );
        };
        const aggregateByWeeks = (data) => {
            const weeks = {};

            data.forEach(({ date, value }) => {
                const year = date.getFullYear();
                const week = getWeekNumber(date);
                const key = `${year}-W${week}`;

                if (!weeks[key]) {
                    weeks[key] = 0;
                }
                weeks[key] += value / 7;
            });

            return weeks;
        };
        const aggregateByMonths = (data) => {
            const months = {};
            const getDaysInMonth = (year, month) => {
                return new Date(year, month, 0).getDate();
            };
            data.forEach(({ date, value }) => {
                const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

                if (!months[key]) {
                    months[key] = 0;
                }
                months[key] +=
                    value / getDaysInMonth(date.getFullYear(), date.getMonth());
            });

            return months;
        };
        const aggregateByYears = (data) => {
            const years = {};
            const getDaysInYear = (year) => {
                if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                    return 366;
                } else {
                    return 365;
                }
            };

            data.forEach(({ date, value }) => {
                const key = date.getFullYear();

                if (!years[key]) {
                    years[key] = 0;
                }
                years[key] += value / getDaysInYear(date.getFullYear());
            });

            return years;
        };
        const prepareChartData = (aggregatedData) => {
            const data = Object.entries(aggregatedData).map(([key, value]) => ({
                label: key,
                value,
            }));
            // Sort data by week (W1, W2,...)
            data.sort((a, b) => {
                const [yearA, weekA] = a.label.split("-W").map(Number);
                const [yearB, weekB] = b.label.split("-W").map(Number);

                // Convert year and week to a date object
                const dateA = new Date(yearA, 0, 1 + (weekA - 1) * 7);
                const dateB = new Date(yearB, 0, 1 + (weekB - 1) * 7);

                return dateA - dateB;
            });

            return data;
        };
        // Aggregating data
        const weeklyData = aggregateByWeeks(dataArray);
        const monthlyData = aggregateByMonths(dataArray);
        const yearlyData = aggregateByYears(dataArray);

        // Preparing data for chart
        const weeklyChartData = prepareChartData(weeklyData);
        const monthlyChartData = prepareChartData(monthlyData);
        const yearlyChartData = prepareChartData(yearlyData);

        if (slectedTypeBar === "weekly")
            setDataAtter(weeklyChartData.slice(-5));
        if (slectedTypeBar === "monthly")
            setDataAtter(monthlyChartData.slice(-5));
        if (slectedTypeBar === "yearly")
            setDataAtter(yearlyChartData.slice(-5));
    };
    const handleChartLineMethodologyOfWork = async (data) => {
        const dataArray = await Promise.all(
            Object.entries(data).map(async ([taskId, value]) => {
                const task = await getTaskById(taskId);

                const date_closed = new Date(
                    Number(task?.date_closed)
                ).toLocaleDateString("en-US");

                return {
                    label: task?.name,
                    value,
                    date_closed,
                };
            })
        );

        // Sort the tasks by date_closed
        dataArray.sort((a, b) => {
            if (!a.date_closed) return 1;
            if (!b.date_closed) return -1;
            return new Date(a.date_closed) - new Date(b.date_closed);
        });

        setDataMethodologyOfWork(dataArray.slice(-8));
    };

    const dataChartLine = {
        labels: dataMethodologyOfWork?.map((data) => data?.label),
        datasets: [
            {
                label: "",
                data: dataMethodologyOfWork?.map((data) => data?.value),
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
            },
        ],
    };
    const optionsChartLine = {
        scales: {
            // x: {
            //     title: {
            //         display: true,
            //         text: 'Months',
            //     },
            //     ticks: {
            //         callback: function(value, index, values) {
            //             return `${value} (Custom)`;
            //         },
            //     },
            // },
            y: {
                title: {
                    display: false,
                    text: "Percent",
                },
                ticks: {
                    beginAtZero: true,
                    callback: function (value, index, values) {
                        return `${value}`;
                    },
                },
                max: 100,
                min: 0,
            },
        },
    };
    const dataChartBar = {
        labels: dataAtter?.map((data) => data?.label),
        datasets: [
            {
                label: " ",
                data: dataAtter?.map((data) => data?.value),
            },
        ],
    };
    const optionsChartBar = {
        scales: {
            y: {
                title: {
                    display: false,
                    text: "Percent",
                },
                ticks: {
                    beginAtZero: true,
                    callback: function (value, index, values) {
                        return `${value}`;
                    },
                },
                max: 100,
            },
        },
    };
    if (true) {
        return (
            <>
                <section className="grid justify-center w-full mx-auto pt-32">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:ml-[80px] lg:grid-cols-3 xl:grid-cols-4 ">
                        <div className="w-[260px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                            <Weather />
                        </div>
                        {/* show all tasks */}
                        {tasksGroupedByStatus?.map((tasks, index) => {
                            return (
                                <StatusCard
                                    key={index}
                                    text={tasks?.[0]}
                                    count={tasks?.[1].length}
                                    color={tasks?.[1][0]?.status?.color}
                                >
                                    {tasks?.[0] == "to do" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-list-checks"
                                        >
                                            <path d="m3 17 2 2 4-4" />
                                            <path d="m3 7 2 2 4-4" />
                                            <path d="M13 6h8" />
                                            <path d="M13 12h8" />
                                            <path d="M13 18h8" />
                                        </svg>
                                    )}
                                    {tasks?.[0] == "in review" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-scan-eye"
                                        >
                                            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                                            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                                            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                                            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                                            <circle cx={12} cy={12} r={1} />
                                            <path d="M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5" />
                                        </svg>
                                    )}
                                    {tasks?.[0] == "rejected" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-git-pull-request-closed"
                                        >
                                            <circle cx={6} cy={6} r={3} />
                                            <path d="M6 9v12" />
                                            <path d="m21 3-6 6" />
                                            <path d="m21 9-6-6" />
                                            <path d="M18 11.5V15" />
                                            <circle cx={18} cy={18} r={3} />
                                        </svg>
                                    )}

                                    {tasks?.[0] == "pending" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-clock-arrow-down"
                                        >
                                            <path d="M12.338 21.994A10 10 0 1 1 21.925 13.227" />
                                            <path d="M12 6v6l2 1" />
                                            <path d="m14 18 4 4 4-4" />
                                            <path d="M18 14v8" />
                                        </svg>
                                    )}

                                    {tasks?.[0] == "in progress" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-loader-circle"
                                        >
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                    )}
                                    {tasks?.[0] == "completed" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-square-check-big"
                                        >
                                            <path d="m9 11 3 3L22 4" />
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                    )}
                                    {tasks?.[0] == "blocked" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-book-key"
                                        >
                                            <path d="m19 3 1 1" />
                                            <path d="m20 2-4.5 4.5" />
                                            <path d="M20 8v13a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14" />
                                            <circle cx={14} cy={8} r={2} />
                                        </svg>
                                    )}
                                    {tasks?.[0] == "Open" && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-package-open"
                                        >
                                            <path d="M12 22v-9" />
                                            <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                                            <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                                            <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
                                        </svg>
                                    )}
                                </StatusCard>
                            );
                        })}
                        {/* show count hour work */}
                        <StatusCard
                            text="Work Time"
                            count={timeTrackedByEmployeeToday}
                            color="#36BA98"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-clock"
                            >
                                <circle cx={12} cy={12} r={10} />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </StatusCard>
                        {/* show total commits today */}
                        <StatusCard
                            text="Commits"
                            count={commits}
                            color="#430A5D"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-git-commit-horizontal"
                            >
                                <circle cx={12} cy={12} r={3} />
                                <line x1={3} x2={9} y1={12} y2={12} />
                                <line x1={15} x2={21} y1={12} y2={12} />
                            </svg>
                        </StatusCard>
                        {/* this is skeleton */}
                        {tasksGroupedByStatus?.length == 0 && (
                            <>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg w-[260px] h-[115px] flex items-center justify-evenly ">
                                    <div className="">
                                        <Skeleton className="h-9 w-[160px] mt-2" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
                <section>
                    <div className="flex w-full flex-wrap gap-4 lg:w-[86%] lg:ml-[106px] xl:w-[86%]  mt-8 xl:px-8 xl:ml-[135px]">
                        <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[52%]  xl:w-[56%] mx-auto  p-3  bg-white rounded-lg">
                            <ul className="flex justify-between items-center py-5 ">
                                <li>General performance</li>
                            </ul>

                            <Line
                                data={dataChartLine}
                                options={optionsChartLine}
                            />
                        </div>

                        <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[42%]   mx-auto xl:w-[40%]  p-3 bg-white rounded-lg">
                            <ul className="flex justify-between items-center pb-2">
                                <li>Statistics</li>
                                <li>
                                    <Select
                                        onValueChange={(value) =>
                                            setSlectedTypeBar(value)
                                        }
                                    >
                                        <SelectTrigger className="">
                                            <AlignCenter className=" cursor-pointer text-slate-700" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>
                                                    Weekly
                                                </SelectLabel> */}
                                                <SelectItem value="weekly">
                                                    Weekly
                                                </SelectItem>
                                                <SelectItem value="monthly">
                                                    Monthly
                                                </SelectItem>
                                                <SelectItem value="yearly">
                                                    Yearly
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </li>
                            </ul>
                            <Bar
                                data={dataChartBar}
                                options={optionsChartBar}
                            />
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
