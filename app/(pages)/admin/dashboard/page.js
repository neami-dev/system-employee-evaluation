"use client";

import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase-config";
import {
    AlignCenter,
    CalendarClock,
    Cloud,
    History,
    Hourglass,
    Moon,
    Users,
} from "lucide-react";
import Weather from "@/components/component/weather";

import CurvedlineChart from "@/components/component/curvedLineChart";
import BarChart from "@/components/component/barChart";
import { getEmployees } from "@/firebase/firebase-admin/getEmployees";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/component/Loading";
import {
    getAllUserIds,
    getCheckInOutTimes,
} from "@/app/api_services/actions/clockifyActions";
import getDocument from "@/firebase/firestore/getDocument";
import { format } from "date-fns";

export default function page() {
    const [clockifyWorkspaceId, setClockifyWorkspaceId] = useState([]);
    const [totalEmployeea, setTotalEmployees] = useState(0);
    const [lateArrival, setLateArrival] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [onTime, setOnTime] = useState(0);
    const [earlyDepartures, setEarlyDepartures] = useState(0);
    const [timeOff, setTimeOff] = useState(0);
    const [date, setDate] = useState(new Date());
    const [isAdmin, setsIsdmin] = useState(false);
    const route = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    route.push("/login");
                    return;
                }
                const response = await getDocument("userData", user?.uid);
                const workspaceId = response?.result.data()?.clockifyWorkspace;

                if (workspaceId) setClockifyWorkspaceId(workspaceId);

                const responseRole = await checkRoleAdmin(user.uid);
                setsIsdmin(responseRole?.result);

                if (!responseRole?.result) {
                    route.push("/Not-Found");
                    console.log("your role is not admin");
                }

                const responseEmp = await getEmployees();
                if (responseEmp?.result) {
                    setTotalEmployees(responseEmp?.result?.length);
                }
            } catch (error) {
                console.log(error.message);
            }
        });
    }, []);

    useEffect(() => {
        const fetchAndSetTimeEntries = async () => {
            try {
                const ClockifyUsers = await getAllUserIds(clockifyWorkspaceId);
                if (ClockifyUsers?.length > 0) {
                    for (const user of ClockifyUsers) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        const dailyEntries = await getCheckInOutTimes(
                            user?.id,
                            clockifyWorkspaceId,
                            formattedDate
                        );
                        if (dailyEntries === null) {
                            return setAbsent((prev) => prev + 1);
                        }
                        const time = new Date(
                            "2000-01-01 " + dailyEntries?.checkInTime
                        );
                        const hour = time.getHours();

                        if (hour <= 9 && hour < 7) {
                            setLateArrival((prev) => prev + 1);
                        }
                        if (hour <= 9) {
                            setOnTime((prev) => prev + 1);
                        }
                        if (hour < 17) {
                            setEarlyDepartures((prev) => prev + 1);
                        }
                        if (hour >= 17) {
                            setTimeOff((prev) => prev + 1);
                        }
                    }
                }
            } catch (error) {
                console.log("Error in fetchAndSetTimeEntries:", error.message);
            }
        };

        fetchAndSetTimeEntries();
    }, [date, clockifyWorkspaceId]);

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

    const itemStyle =
        "bg-white rounded-lg w-[260px] h-[115px] flex flex-col   justify-evenly ";
    if (isAdmin) {
        return (
            <>
                <section className=" grid justify-center w-full mx-auto pt-32">
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:ml-[80px] lg:grid-cols-3 xl:grid-cols-4 ">
                        <li className="w-[260px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                            <Weather />
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">
                                    {totalEmployeea}
                                </span>
                                <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                    <Users className="text-blue-500" />
                                </span>
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                Total Employees
                            </h3>
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">{onTime}</span>
                                <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                    <History className="text-blue-500" />
                                </span>
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                On Time
                            </h3>
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">{absent}</span>
                                <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                    <Cloud className="text-blue-500" />
                                </span>
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                Absent
                            </h3>
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">{lateArrival}</span>
                                <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                    <Hourglass className="text-blue-500" />
                                </span>
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                Late Arrival
                            </h3>
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">
                                    {earlyDepartures}
                                </span>
                                <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                    <Moon className="text-blue-500" />
                                </span>
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                Early Departures
                            </h3>
                        </li>
                        <li className={`${itemStyle}`}>
                            <div className="flex justify-between px-5 w-full ">
                                <span className=" text-4xl">{timeOff}</span>
                                <CalendarClock className="text-blue-500" />
                            </div>
                            <h3 className="text-[#252C58] ml-5 text-lg">
                                Time-off
                            </h3>
                        </li>
                    </ul>
                </section>
                <section>
                    <div className="flex w-full flex-wrap gap-4 lg:w-[86%] lg:ml-[106px] xl:w-[90%]  mt-8 xl:px-8">
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
