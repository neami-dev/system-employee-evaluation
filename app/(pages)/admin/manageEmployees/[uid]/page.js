"use client";
import { getCheckInOutTimes } from "@/app/api_services/actions/clockifyActions";
import { getTotalCommitEmplyee } from "@/app/api_services/actions/githubActions";
import Loading from "@/components/component/Loading";
import { useToast } from "@/components/ui/use-toast";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { getCookie } from "cookies-next";

import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import { Clock3, CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function detailsPage({ params }) {
    const uid = params?.uid;
    const { toast } = useToast();
    const [time, setTime] = useState(null);
    const [statusTime, setStatusTime] = useState(null);
    const [totalCommit, setTotalcommit] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const timeOfEntry = 9;
    const timeOfExit = 17;
    const numberCommit = 3;

    if (!uid) {
        console.log("not found params");
        toast({
            description: "not found params",
            variant: "destructive",
        });
        return false;
    }

    useEffect(() => {
        try {
            setIsAdmin(getCookie("isAdmin") || false);
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    return router.push("/login");
                }
                const responseRole = await checkRoleAdmin(user?.uid);
                setIsAdmin(responseRole?.result);
                if (!responseRole?.result) {
                    return router.push("/Not-Found");
                }
            });
            // uid from params

            hanldeTatalCommit();
            handleTimeWorking();
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    const hanldeTatalCommit = async () => {
        const responseEmp = await getDocument("userData", uid);
        if (!responseEmp?.result?.data()) {
            return toast({
                description: "not found employee by this uid : " + uid,
                variant: "destructive",
            });
        }
        const githubRepo = responseEmp?.result?.data()?.githubRepo;
        const username = responseEmp?.result?.data()?.username;
        const responseGithub = await getTotalCommitEmplyee(
            githubRepo,
            username
        );
        setTotalcommit(responseGithub);
    };

    const handleTimeWorking = async () => {
        try {
            const response = await getDocument("userData", uid);
            const workspaceId = response?.result.data()?.clockifyWorkspace;
            const clockifyUserId = response?.result.data()?.clockifyUserId;
            const currenttDate = new Date();

            const formattedDate = format(currenttDate, "yyyy-MM-dd");
            const dailyEntries = await getCheckInOutTimes(
                clockifyUserId,
                workspaceId,
                formattedDate
            );

            console.log("dailyEntries", dailyEntries);
            if (currenttDate.getHours() > timeOfExit && dailyEntries === null) {
                setTime(false);
                return setStatusTime(0);
            }
            if (dailyEntries === null) {
                return setTime(false);
            }
            const entryTime = new Date(
                "2000-01-01 " + dailyEntries?.checkInTime
            );
            const timeToLeave = new Date(
                "2000-01-01 " + dailyEntries?.checkOutTime
            );
            const difference = Math.abs(timeToLeave - entryTime);
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTime(`${hours}:${minutes}:${seconds}`);

            if (entryTime.getHours() > timeOfEntry) {
                setStatusTime(1);
            }
            if (entryTime.getHours() <= timeOfEntry) {
                setStatusTime(2);
            }
            if (
                currenttDate.getHours() >= timeOfExit &&
                timeToLeave.getHours() < timeOfExit
            ) {
                setStatusTime(3);
            }
            if (
                currenttDate.getHours() >= timeOfExit &&
                timeToLeave.getHours() >= timeOfExit
            ) {
                setStatusTime(4);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
  
    if (String(isAdmin)?.toLowerCase() === "true") {
        return (
            <div className="mt-[140px]  w-[92%] mx-auto min-[426px]:w-[72%] min-[426px]:ml-[100px] sm:w-[80%] sm:ml-[100px] md:ml-[124px] lg:w-[82%] lg:ml-[135px]  xl:w-[85%] xl:ml-[145px]">
                <section className=" p-2 flex gap-3">
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex justify-around gap-7  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Working time
                            </h3>
                            <Clock3 className="text-[#008DDA]" size={26} />
                        </div>
                        <div className="mt-[14px] text-center ">
                            {time === false && statusTime !== 0 && (
                                <p className="text-[#453F78] h-[40px]">
                                    Didn't count time
                                </p>
                            )}
                            {time === null && (
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 mt-2 text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}
                            {time && (
                                <p className="text-[#224470] font-bold text-[30px]">
                                    {time}
                                </p>
                            )}
                        </div>
                        <div className="mt-2">
                            {statusTime == 0 && (
                                <span className="bg-red-100 text-red-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    Absent
                                </span>
                            )}
                            {statusTime == 1 && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                    Late arrival
                                </span>
                            )}
                            {statusTime == 2 && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    On Time
                                </span>
                            )}
                            {statusTime == 3 && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                                    Early Departures
                                </span>
                            )}
                            {statusTime == 4 && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Time-off
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex justify-around gap-7  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Github commits
                            </h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-circle-check-big text-[#008DDA]"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <path d="m9 11 3 3L22 4" />
                            </svg>
                        </div>
                        <div className="mt-[14px] text-center">
                            {totalCommit !== null &&
                                totalCommit !== undefined && (
                                    <span className="text-[#224470] font-bold text-[30px] h-[40px]">
                                        {totalCommit}/{numberCommit}
                                    </span>
                                )}
                            {totalCommit === null && (
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 mt-2 text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="mt-2">
                            {totalCommit === undefined && (
                                <span className="bg-red-100 text-red-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    lack informition
                                </span>
                            )}
                            {totalCommit !== null &&
                                totalCommit !== undefined &&
                                totalCommit < numberCommit && (
                                    <span className="bg-red-100 text-red-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                        Poor
                                    </span>
                                )}
                            {totalCommit == numberCommit && (
                                <span className="bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    Good
                                </span>
                            )}
                            {totalCommit > numberCommit && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Excellent
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        );
    } else {
        return <Loading />;
    }
}
