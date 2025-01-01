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
import getDocuments from "@/firebase/firestore/getDocuments";
import StatusCard from "@/components/component/statusCard";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function page() {
    const [clockifyWorkspaceId, setClockifyWorkspaceId] = useState([]);
    const [inYourWorkspace, setInYourWorkspace] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalEmployeesInHoliday, setTotalEmployeesInHoliday] = useState(0);
    const [lateArrival, setLateArrival] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [onTime, setOnTime] = useState(0);
    const [inProgress, setInProgress] = useState(0);
    const [earlyDepartures, setEarlyDepartures] = useState(0);
    const [timeOff, setTimeOff] = useState(0);
    const [dataAtter, setDataAtter] = useState([]);
    const [dataMethodologyOfWork, setDataMethodologyOfWork] = useState([]);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedDate = format(yesterday, "yyyy-MM-dd");
    const [date, setDate] = useState(formattedDate);

    const timeOfEntry = 9;
    const timeOfExit = 17;
   
    const getTotalEmployees = async () => {
        const employees = await getEmployees();
        let total = 0;

        if (employees?.result && !employees?.error) {
            await Promise.all(
                employees.result.map(async (user) => {
                    const response = await getDocument("userData", user?.uid);

                    if (
                        response?.result &&
                        !response?.error &&
                        user?.uid === response?.result?.id &&
                        response?.result?.data()
                    ) {
                        total += 1;
                    }
                })
            );
        }
        setTotalEmployees(total);
    };
    useEffect(() => {
        getEvaluations();
        getTotalEmployees();

        onAuthStateChanged(auth, async (user) => {
            try {
                const response = await getDocument("userData", user?.uid);
                const workspaceId = response?.result.data()?.clockifyWorkspace;

                if (workspaceId) setClockifyWorkspaceId(workspaceId);
            } catch (error) {
                console.log(error.message);
            }
        });
    }, []);
    const getEvaluations = async () => {
        const response = await getDocuments("evaluation");
        response?.result.forEach((doc) => {
            console.log(doc.data());
        });
    };
    useEffect(() => {
        try {
            const getTotalEmployeeInHoliday = async () => {
                const holidays = await getDocuments("holidays");
                let total = 0;

                const isDateBetween = (date, startDate, endDate) => {
                    const targetDate = new Date(date);
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    return targetDate >= start && targetDate <= end;
                };

                holidays?.result?.forEach((doc) => {
                    const { from, to } = doc.data();

                    if (isDateBetween(date, from, to)) {
                        total += 1;
                    }
                });
                setTotalEmployeesInHoliday(total);
            };
            getTotalEmployeeInHoliday();
            const handleTimeWorking = async () => {
                const clockifyUsers = await getAllUserIds(clockifyWorkspaceId);
                setInYourWorkspace(clockifyUsers?.length || 0);

                const isWeekend = () => {
                    const day = new Date(date).getDay();
                    return day === 0 || day === 6;
                };
                clockifyUsers?.map(async (user) => {
                    // console.log("user ", user);

                    const workspaceId = user?.defaultWorkspace;
                    const clockifyUserId = user?.id;

                    const dailyEntries = await getCheckInOutTimes(
                        clockifyUserId,
                        workspaceId,
                        date
                    );
                    if (dailyEntries === null && !isWeekend()) {
                        setAbsent((prev) => (prev += 1));
                    }

                    if (dailyEntries?.checkOutTime == "In progress") {
                        setInProgress((prev) => (prev += 1));
                    }
                });
            };

            handleTimeWorking();
        } catch (error) {
            console.error(error.message);
        }
    }, [date, clockifyWorkspaceId]);

    const data = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
        ],
        datasets: [
            {
                label: "Sales",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <section className=" grid justify-center w-full mx-auto pt-32">
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:ml-[80px] lg:grid-cols-3 xl:grid-cols-4 ">
                    <li className="w-[260px] md:row-span-2 lg:row-span-3 xl:row-span-2">
                        <Weather />
                    </li>
                    <StatusCard
                        text="Employees"
                        count={totalEmployees}
                        color="#430A5D"
                    >
                        <Users className="text-blue-500" />
                    </StatusCard>

                    <StatusCard
                        text="In your workspace"
                        count={inYourWorkspace}
                        color="#430A5D"
                    >
                        <Users className="text-blue-500" />
                    </StatusCard>

                    <StatusCard
                        text="In holiday"
                        count={totalEmployeesInHoliday}
                        color="#430A5D"
                    >
                        <span className=" bg-[#E6EAF5] rounded-full">
                            <svg
                                fill="#3b82f6"
                                width="24px"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M442.458 506.633l526.285 319.386c9.669 5.868 22.265 2.786 28.133-6.883s2.786-22.265-6.883-28.133L463.708 471.617c-9.669-5.868-22.265-2.786-28.133 6.883s-2.786 22.265 6.883 28.133z" />
                                <path d="M471.605 496.4c69.645-88.617 219.439-102.62 347.816-28.496 132.967 76.763 194.927 220.077 144.852 325.443-4.855 10.216-.509 22.433 9.706 27.288s22.433.509 27.288-9.706c60.149-126.562-11.322-291.875-161.366-378.497-144.745-83.575-317.1-67.463-400.501 38.659-6.989 8.893-5.446 21.768 3.447 28.757s21.768 5.446 28.757-3.447z" />
                                <path d="M684.302 659.986L486.25 992.53c-5.788 9.718-2.602 22.288 7.116 28.075s22.288 2.602 28.075-7.116l198.052-332.544c5.788-9.718 2.602-22.288-7.116-28.075s-22.288-2.602-28.075 7.116zm159.905-278.013l-27.699 47.974c-5.656 9.795-2.3 22.321 7.496 27.976s22.321 2.3 27.976-7.496l27.699-47.974c5.656-9.795 2.3-22.321-7.496-27.976s-22.321-2.3-27.976 7.496zm-518.698-143.64c0-46.166-37.423-83.589-83.589-83.589s-83.589 37.423-83.589 83.589 37.423 83.589 83.589 83.589 83.589-37.423 83.589-83.589zm40.96 0c0 68.788-55.761 124.549-124.549 124.549s-124.549-55.761-124.549-124.549c0-68.788 55.761-124.549 124.549-124.549s124.549 55.761 124.549 124.549zM221.44 20.48h40.96V51.2h-40.96V20.48zM262.4 51.2c0 27.307-40.96 27.307-40.96 0V20.48c0-27.307 40.96-27.307 40.96 0V51.2zm-40.96 381.44h40.96v30.72h-40.96v-30.72zm40.96 30.72c0 27.307-40.96 27.307-40.96 0v-30.72c0-27.307 40.96-27.307 40.96 0v30.72zM70.853 99.817l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963L70.854 99.817c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zm240.748 298.674l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963l-21.729-21.729c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zM20.48 262.4v-40.96H51.2v40.96H20.48zm30.72-40.96c27.307 0 27.307 40.96 0 40.96H20.48c-27.307 0-27.307-40.96 0-40.96H51.2zm412.16 0c27.307 0 27.307 40.96 0 40.96h-30.72c-27.307 0-27.307-40.96 0-40.96h30.72zM92.583 362.294c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729zm291.44-291.441c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729z" />
                            </svg>
                        </span>
                    </StatusCard>

                    <StatusCard
                        text="Absent"
                        count={absent && absent - totalEmployeesInHoliday}
                        color="#430A5D"
                    >
                        <Cloud className="text-blue-500" />
                    </StatusCard>

                    {/* <li className={`${itemStyle}`}>
                        <div className="flex justify-between px-5 w-full ">
                            <span className=" text-4xl">{lateArrival}</span>
                            <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                <Hourglass className="text-blue-500" />
                            </span>
                        </div>
                        <h3 className="text-[#252C58] ml-5 text-lg">
                            Late Arrival
                        </h3>
                    </li> */}
                    {/* <li className={`${itemStyle}`}>
                        <div className="flex justify-between px-5 w-full ">
                            <span className=" text-4xl">{earlyDepartures}</span>
                            <span className=" bg-[#E6EAF5] p-2 rounded-full">
                                <Moon className="text-blue-500" />
                            </span>
                        </div>
                        <h3 className="text-[#252C58] ml-5 text-lg">
                            Early Departures
                        </h3>
                    </li> */}
                    {/* <li className={`${itemStyle}`}>
                        <div className="flex justify-between px-5 w-full ">
                            <span className=" text-4xl">{timeOff}</span>
                            <CalendarClock className="text-blue-500" />
                        </div>
                        <h3 className="text-[#252C58] ml-5 text-lg">
                            Time-off
                        </h3>
                    </li> */}
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

                        {/* <CurvedlineChart data={dataChart} /> */}
                    </div>

                    <div className="w-[90%] min-[426px]:w-[80%] min-[426px]:ml-[66px] sm:ml-auto sm:w-[70%] lg:w-[42%]   mx-auto xl:w-[40%] h-[350px] p-3 bg-white rounded-lg">
                        <ul className="flex justify-between items-center">
                            <li>Statistics</li>
                            <li>
                                <AlignCenter className=" cursor-pointer text-slate-700" />
                            </li>
                        </ul>
                        <Line data={data} options={options} />;
                    </div>
                </div>
            </section>
        </>
    );
}
