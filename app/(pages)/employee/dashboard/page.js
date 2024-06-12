"use client";

import React, { Suspense, useEffect, useState } from "react";

import "react-circular-progressbar/dist/styles.css";
import {
    getAllTasksByEmployee,
    getAuthenticatedUserDetails,
    getCompletedTasksByEmployee,
    getHoldTasksByEmployee,
    getInProgressTasksByEmployee,
    getOpenTasksByEmployee,
    getPendingTasksByEmployee,
    getTaskById,
    getTeams,
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
import StatusCard from "./components/statusCard";
import { onAuthStateChanged } from "firebase/auth";

export default function page() {
    const [clickupData, setClickupData] = useState({
        allTasks: null,
        completeTask: null,
        inProgressTask: null,
        holdTask: null,
        pendingTask: null,
    });
    const [commits, setCommits] = useState(null);
    const [timeTrackedByEmployeeToday, setTimeTrackedByEmployeeToday] =
        useState(null);

    const [dataAtter, setDataAtter] = useState([]);
    const [dataMethodologyOfWork, setDataMethodologyOfWork] = useState([]);
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                getInfo(user?.uid);
                const data = await getEvaluation(user?.uid);
                if (
                    data?.attributes !== null &&
                    data?.attributes !== undefined &&
                    data?.methodologyOfWork !== null &&
                    data?.methodologyOfWork !== undefined
                ) {
                    handleChartBarAtter(data?.attributes);
                    handleChartLineMethodologyOfWork(data?.methodologyOfWork);
                }
            }
        });
    }, []);
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

            // function to get information from clickUp
            const [
                allTasks,
                completeTask,
                inProgressTask,
                holdTask,
                pendingTask,
                workTime,
                totalCommits,
            ] = await Promise.allSettled([
                getAllTasksByEmployee(clickupTeam, clickupUser),
                getCompletedTasksByEmployee(clickupTeam, clickupUser),
                getInProgressTasksByEmployee(clickupTeam, clickupUser),
                getHoldTasksByEmployee(clickupTeam, clickupUser),
                getPendingTasksByEmployee(clickupTeam, clickupUser),

                getTimeTrackedByEmployeeToday(
                    clockifyUserId,
                    clockifyWorkspace
                ),
                getTotalCommitsForToday(),
            ]);

            setClickupData({
                allTasks: allTasks?.value?.length,
                completeTask: completeTask?.value?.length,
                inProgressTask: inProgressTask?.value?.length,
                holdTask: holdTask?.value?.length,
                pendingTask: pendingTask?.value?.length,
            });
            setTimeTrackedByEmployeeToday(workTime?.value?.hours);
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
            return Object.entries(aggregatedData).map(([key, value]) => ({
                label: key,
                value,
            }));
        };
        // Aggregating data
        const weeklyData = aggregateByWeeks(dataArray);
        const monthlyData = aggregateByMonths(dataArray);
        const yearlyData = aggregateByYears(dataArray);

        // Preparing data for chart
        const weeklyChartData = prepareChartData(weeklyData);
        const monthlyChartData = prepareChartData(monthlyData);
        const yearlyChartData = prepareChartData(yearlyData);

        console.log("Weekly Chart Data:", weeklyChartData);
        console.log("Monthly Chart Data:", monthlyChartData);
        console.log("Yearly Chart Data:", yearlyChartData);
        setDataAtter(weeklyChartData.slice(-5));
    };
    const handleChartLineMethodologyOfWork = async (data) => {
        const dataArray = await Promise.all(
            Object.entries(data).map(async ([taskId, value]) => {
                const task = await getTaskById(taskId);
                return { label: task?.name, value };
            })
        );

        setDataMethodologyOfWork(dataArray.slice(-8));
    };

    const progressPercentageTask = () => {
        if (clickupData?.allTasks !== null) {
            return {
                tasksInProgress: Math.round(
                    (clickupData?.inProgressTask * 100) / clickupData?.allTasks
                ),
                tasksPending: Math.round(
                    (clickupData?.pendingTask * 100) / clickupData?.allTasks
                ),
                tasksCompleted: Math.round(
                    (clickupData?.completeTask * 100) / clickupData?.allTasks
                ),
                tasksOnHold: Math.round(
                    (clickupData?.holdTask * 100) / clickupData?.allTasks
                ),
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

    const dataChartLine = {
        labels: dataMethodologyOfWork?.map((data) => data?.label),
        datasets: [
            {
                label: "Dataset 1",
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

                        <StatusCard
                            text="Tasks Complete"
                            percent={progressPercentageTask()?.tasksCompleted}
                            countAll={clickupData?.allTasks}
                            count={clickupData?.completeTask}
                        />

                        <StatusCard
                            text="Tasks in Progress"
                            percent={progressPercentageTask()?.tasksInProgress}
                            countAll={clickupData?.allTasks}
                            count={clickupData?.inProgressTask}
                        />

                        <StatusCard
                            text="Tasks On Hold"
                            percent={progressPercentageTask()?.tasksOnHold}
                            countAll={clickupData?.allTasks}
                            count={clickupData?.holdTask}
                        />

                        <StatusCard
                            text="tasks Pending"
                            percent={progressPercentageTask()?.tasksPending}
                            countAll={clickupData?.allTasks}
                            count={clickupData?.pendingTask}
                        />

                        <StatusCard
                            text="Work Time"
                            percent={progressPercentageTimeWork()}
                            countAll={"8H"}
                            count={timeTrackedByEmployeeToday}
                        />

                        <StatusCard
                            text="Commits"
                            percent={progressPercentageCommits()}
                            countAll={"3"}
                            count={commits}
                        />
                    </div>
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

                            <Line
                                data={dataChartLine}
                                options={optionsChartLine}
                            />
                        </div>

                        <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[42%]   mx-auto xl:w-[40%] h-[350px] p-3 bg-white rounded-lg">
                            <ul className="flex justify-between items-center">
                                <li>Statistics</li>
                                <li>
                                    <AlignCenter className=" cursor-pointer text-slate-700" />
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
