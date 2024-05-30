"use client";
import {
    getClosedTasksByEmployee,
    getRejectedTasksByEmployee,
} from "@/app/api_services/actions/clickupActions";
import { getCheckInOutTimes } from "@/app/api_services/actions/clockifyActions";
import { getTotalCommitEmplyee } from "@/app/api_services/actions/githubActions";
import Loading from "@/components/component/Loading";
import { Calendar } from "@/components/ui/calendar";

import { useToast } from "@/components/ui/use-toast";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import { auth } from "@/firebase/firebase-config";

import getDocument from "@/firebase/firestore/getDocument";
import setDocumment from "@/firebase/firestore/setDocumment";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import {
    Check,
    ChevronsUpDown,
    Flag,
    FlaskConical,
    GitCompareArrows,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Clock3, Speech, CalendarIcon, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function detailsPage({ params }) {
    const uid = params?.uid;
    const { toast } = useToast();
    const [time, setTime] = useState(null);
    const [statusTime, setStatusTime] = useState(null);
    const [totalCommit, setTotalcommit] = useState(null);
    const [evaluationComminu, setEvaluationComminu] = useState(null);
    const [respectWork, setRespectWork] = useState(null);
    const [evaluationDoc, setEvaluationDoc] = useState(null);
    const [evaluationTest, setEvaluationTest] = useState(null);
    const [evaluationComplexit, setEvaluationComplexit] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [taskSelected, settaskSelected] = useState(null);
    const [taskPunctuality, settaskPunctuality] = useState(null);
    const [durationTask, setDurationTask] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const timeOfEntry = 9;
    const timeOfExit = 17;
    const numberCommit = 3;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedDate = format(yesterday, "yyyy-MM-dd");
    const [date, setDate] = useState(formattedDate);

    
    const handleDate = async (Date) => {
        const formattedDate = format(Date, "yyyy-MM-dd");
        if (formattedDate === date) return;
        setDate(formattedDate);
        setTime(null);
        setTotalcommit(null);
        setStatusTime(null);
        setEvaluationComminu(null);
        setRespectWork(null);
    };
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
                    console.log("is admin", responseRole);
                    // return router.push("/Not-Found");
                }
            });
            hanldeTatalCommit();
            handleTimeWorking();
            getAttributes();
        } catch (error) {
            console.error(error.message);
        }
    }, [date]); //rendering when change date
    useEffect(() => {
        getClosedTask();
        getRejectedTask();
    }, []);
    useEffect(() => {
        handleTaskPunctuality();
        getMethodologyOfWork();
        calculateEvaluation();
    }, [tasks, taskSelected]); //rendering when change tasks, taskSelected

    const getAttributes = async () => {
        const response = await getDocument("attributes", uid);
        console.log("responseEmp", response?.result?.data()?.respectWork[date]);
        const attributes = response?.result?.data();
        const evaluationComminu = attributes?.communication[date];
        const evaluationRespect = attributes?.respectWork[date];
        setEvaluationComminu(evaluationComminu);
        setRespectWork(evaluationRespect);
        return {evaluationComminu,evaluationRespect};
    };
    const getMethodologyOfWork = async () => {
        const response = await getDocument("methodologyOfWork", uid);

        if (!taskSelected) {
            return;
        }
        const doc = response?.result?.data()?.documentation?.[taskSelected?.id];
        const test = response?.result?.data()?.test?.[taskSelected?.id];
        const complexity =
            response?.result?.data()?.complexity?.[taskSelected?.id];
        setEvaluationDoc(doc);
        setEvaluationTest(test);
        console.log("complexity", complexity);

        setEvaluationComplexit(complexity);
    };
    const getClosedTask = async () => {
        const response = await getDocument("userData", uid);
        const clickupTeamID = response?.result?.data()?.clickupTeam;
        const clickupUserID = response?.result?.data()?.clickupUser;
        const responseTasks = await getClosedTasksByEmployee(
            clickupTeamID,
            clickupUserID
        );
        console.log("responseTasks", responseTasks);
        if (responseTasks !== null) {
            setTasks(responseTasks);
            // default task
            settaskSelected(responseTasks[0]);
        }
    };
    const getRejectedTask = async () => {
        const response = await getDocument("userData", uid);
        const clickupTeamID = response?.result?.data()?.clickupTeam;
        const clickupUserID = response?.result?.data()?.clickupUser;
        const responseTasks = await getRejectedTasksByEmployee(
            clickupTeamID,
            clickupUserID
        );
        //    console.log(responseTasks);
    };
    const handleTaskPunctuality = () => {
        let evaluation = null;
        console.log(taskSelected);
        const dueDate = taskSelected?.due_date;
        const dateDone = taskSelected?.date_done;
        if (dueDate === null) {
            toast({
                description: "not found due Date ",
                variant: "destructive",
            });
        }

        if (parseInt(dueDate, 10) < parseInt(dateDone, 10)) {
            const timestampDiff =
                parseInt(dateDone, 10) - parseInt(dueDate, 10);
            const seconds = Math.abs(Math.floor(timestampDiff / 1000));
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            setDurationTask(`-${days}:${hours}:${minutes}:${remainingSeconds}`);
            settaskPunctuality(0);
            evaluation = 0;
        } else if (parseInt(dueDate, 10) === parseInt(dateDone, 10)) {
            settaskPunctuality(1);
            evaluation = 1;
        } else if (parseInt(dueDate, 10) > parseInt(dateDone, 10)) {
            const timestampDiff =
                parseInt(dueDate, 10) - parseInt(dateDone, 10);
            const seconds = Math.abs(Math.floor(timestampDiff / 1000));
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            setDurationTask(`${days}:${hours}:${minutes}:${remainingSeconds}`);
            settaskPunctuality(2);
            evaluation = 2;
        }
        return evaluation;
        // Calculate days, hours, minutes, and seconds

        // const formatteddueDate = format(
        //     new Date(parseInt(dueDate, 10)),
        //     "yyyy-MM-dd"
        // );
        // const formatteddateDone = format(
        //     new Date(parseInt(dateDone, 10)),
        //     "yyyy-MM-dd"
        // );
        // console.log({ formatteddueDate, formatteddateDone });
    };
    const handleTimeWorking = async () => {
        try {
            let evaluation = null;
            const response = await getDocument("userData", uid);
            const workspaceId = response?.result.data()?.clockifyWorkspace;
            const clockifyUserId = response?.result.data()?.clockifyUserId;

            const dailyEntries = await getCheckInOutTimes(
                clockifyUserId,
                workspaceId,
                date
            );

            const formattedDate = format(today, "yyyy-MM-dd");
            console.log(
                "dailyEntries==",
                dailyEntries?.checkOutTime == "In progress"
            );
            if (
                dailyEntries === null ||
                dailyEntries?.checkOutTime == "In progress"
            ) {
                if (date == formattedDate && today.getHours() < timeOfExit) {
                    setTime(null);
                    setStatusTime(null);
                } else {
                    setTime(false);
                    setStatusTime(0);
                    evaluation = 0;
                }

                return false;
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
            if (hours > 8) {
                evaluation = 2;
            } else if (hours == 8) {
                evaluation = 1;
            } else {
                evaluation = 0;
            }
            if (entryTime.getHours() > timeOfEntry) {
                setStatusTime(1);
            }
            if (entryTime.getHours() <= timeOfEntry) {
                setStatusTime(2);
            }
            if (
                today.getHours() >= timeOfExit &&
                timeToLeave.getHours() < timeOfExit
            ) {
                setStatusTime(3);
            }
            if (
                today.getHours() >= timeOfExit &&
                timeToLeave.getHours() >= timeOfExit
            ) {
                setStatusTime(4);
            }
            return evaluation;
        } catch (error) {
            console.error(error.message);
        }
    };
    const hanldeTatalCommit = async () => {
        try {
            let evaluation = null;
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
                username,
                date
            );

            if (responseGithub > 3) {
                evaluation = 2;
            } else if (responseGithub == 3) {
                evaluation = 1;
            } else {
                evaluation = 0;
            }

            if (responseGithub !== undefined) {
                setTotalcommit(responseGithub);
            }
            return evaluation;
        } catch (error) {
            console.error(error.message);
        }
    };
    //   (start) functions save evaluations in firebase
    const handlecommunication = async (evaluation) => {
        const response = await setDocumment({
            collectionName: "attributes",
            id: uid,
            data: { communication: { [date]: evaluation } },
        });
        if (response?.error !== null) {
            getAttributes();
            toast({
                description: "problem in server",
                variant: "destructive",
            });
        } else {
            toast({
                description: "successful",
            });
        }
    };
    const handleRespectWork = async (evaluation) => {
        const response = await setDocumment({
            collectionName: "attributes",
            id: uid,
            data: { respectWork: { [date]: evaluation } },
        });

        if (response?.error !== null) {
            getAttributes();
            toast({
                description: "problem in server",
                variant: "destructive",
            });
        } else {
            toast({
                description: "successful",
            });
        }
    };
    const handleDocs = async (evaluation) => {
        const response = await setDocumment({
            collectionName: "methodologyOfWork",
            id: uid,
            data: { documentation: { [taskSelected?.id]: evaluation } },
        });
        if (response?.error !== null) {
            getMethodologyOfWork();
            toast({
                description: "problem in server",
                variant: "destructive",
            });
        } else {
            toast({
                description: "successful",
            });
        }
    };
    const handleTaskTest = async (evaluation) => {
        const response = await setDocumment({
            collectionName: "methodologyOfWork",
            id: uid,
            data: { test: { [taskSelected?.id]: evaluation } },
        });
        if (response?.error !== null) {
            getMethodologyOfWork();
            toast({
                description: "problem in server",
                variant: "destructive",
            });
        } else {
            toast({
                description: "successful",
            });
        }
    };
    const handleTaskComplexity = async (evaluation) => {
        const response = await setDocumment({
            collectionName: "methodologyOfWork",
            id: uid,
            data: { complexity: { [taskSelected?.id]: evaluation } },
        });
        if (response?.error !== null) {
            getMethodologyOfWork();
            toast({
                description: "problem in server",
                variant: "destructive",
            });
        } else {
            toast({
                description: "successful",
            });
        }
    };
    const calculateEvaluation = async () => {
        const currentTime = new Date().getHours();
        // console.log(currentTime);
        console.log("Punctuality", handleTaskPunctuality());
        const responseWorkTime = await handleTimeWorking();
        console.log("work time", responseWorkTime);
        const responseTotalCommit = await hanldeTatalCommit();
        console.log("total commit ", responseTotalCommit);
        await getAttributes();
        console.log("evaluationComminu", evaluationComminu);
        console.log("respectWork", respectWork);
    };

    // (end) functions save evaluations in firebase

    if (String(isAdmin)?.toLowerCase() === "true") {
        return (
            <div className="mt-[140px] w-[92%] mx-auto min-[426px]:w-[72%] min-[426px]:ml-[100px] sm:w-[80%] sm:ml-[100px] md:ml-[124px] lg:w-[82%] lg:ml-[135px]  xl:w-[85%] xl:ml-[145px]">
                <div className="flex  items-center justify-between m-3">
                    <h3 className="ml-2 mt-2 text-[14px] pr-2 sm:text-[20px] font-medium sm:font-semibold text-[#453F78]">
                        Attributs
                    </h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className=" min-w-44 px-3 py-2 bg-white text-[#453F78] font-medium items-center  flex rounded-md">
                                {date ? (
                                    format(date, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div>
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDate}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                    }
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <section className=" p-2 flex justify-around flex-wrap gap-3 lg:flex-nowrap">
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Working time
                            </h3>
                            <Clock3 className="text-[#008DDA]" size={26} />
                        </div>
                        <div className="mt-[14px] text-center ">
                            {time === false && statusTime !== 0 && (
                                <p className="text-[#453F78] h-[40px] font-medium">
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
                        <div className="flex w-full justify-around items-center">
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
                            {totalCommit !== null && (
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
                            {totalCommit !== null &&
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
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Communication
                            </h3>
                            <Speech className="text-[#008DDA]" size={26} />
                        </div>
                        {evaluationComminu === null ? (
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mt-7 block text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
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
                        ) : (
                            <div>
                                <div className="mt-[14px]">
                                    <h3 className="text-[#344767] font-medium ">
                                        {evaluationComminu === null
                                            ? "Enter a ranting"
                                            : "Change a ranting"}
                                    </h3>
                                </div>
                                <ul className="flex justify-around mt-5">
                                    <li>
                                        <button
                                            onClick={() => {
                                                handlecommunication(0);
                                                setEvaluationComminu(0);
                                            }}
                                            className={` ${
                                                evaluationComminu == 0 &&
                                                "bg-red-600 text-white"
                                            } bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300`}
                                        >
                                            Poor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handlecommunication(1);
                                                setEvaluationComminu(1);
                                            }}
                                            className={` ${
                                                evaluationComminu == 1 &&
                                                "bg-yellow-600 text-white"
                                            } bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                                        >
                                            Good
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handlecommunication(2);
                                                setEvaluationComminu(2);
                                            }}
                                            className={` ${
                                                evaluationComminu == 2 &&
                                                "bg-green-600 text-white"
                                            } bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
                                        >
                                            Excellent
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex justify-around gap-7  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Respect work
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
                                className="lucide lucide-briefcase-business text-[#008DDA]"
                            >
                                <path d="M12 12h.01" />
                                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="6"
                                    rx="2"
                                />
                            </svg>
                        </div>
                        {respectWork === null ? (
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mt-7 block text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
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
                        ) : (
                            <div>
                                <div className="mt-[14px]">
                                    <h3 className="text-[#344767] font-medium ">
                                        {respectWork === null
                                            ? "Enter a ranting"
                                            : "Change a ranting"}
                                    </h3>
                                </div>
                                <ul className="flex justify-around mt-5">
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleRespectWork(0);
                                                setRespectWork(0);
                                            }}
                                            className={` ${
                                                respectWork == 0 &&
                                                "bg-red-600 text-white"
                                            } bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300`}
                                        >
                                            Poor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleRespectWork(1);
                                                setRespectWork(1);
                                            }}
                                            className={` ${
                                                respectWork == 1 &&
                                                "bg-yellow-600 text-white"
                                            } bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                                        >
                                            Good
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleRespectWork(2);
                                                setRespectWork(2);
                                            }}
                                            className={` ${
                                                respectWork == 2 &&
                                                "bg-green-600 text-white"
                                            } bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
                                        >
                                            Excellent
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
                <div className="flex  items-center justify-between m-3 mt-6">
                    <h3 className="ml-2 text-[14px] sm:text-[20px] font-medium sm:font-semibold text-[#453F78]">
                        Methodology of work
                    </h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-[200px] justify-between ml-2 mt-2 text-[14px] pr-2 sm:text-[18px] font-medium sm:font-semibold text-[#453F78]"
                            >
                                {taskSelected === null ? (
                                    <>
                                        <svg
                                            aria-hidden="true"
                                            role="status"
                                            className="inline w-4 h-4 me-3 text-white animate-spin"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="#E5E7EB"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    taskSelected?.name
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandGroup>
                                    {tasks?.map((task) => (
                                        <div key={task?.id}>
                                            <div
                                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                onClick={() => {
                                                    if (task !== taskSelected) {
                                                        setEvaluationDoc(null);
                                                    }
                                                    settaskSelected(task);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        task?.id ==
                                                            taskSelected?.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {task?.name}
                                            </div>
                                            <CommandSeparator />
                                        </div>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <section className=" p-2 flex justify-around flex-wrap gap-3 lg:flex-nowrap">
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Task punctuality
                            </h3>
                            <svg
                                className="w-[26px] h-[26px] text-gray-200  fill-blue-500 "
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M868.215446 675.381068c0 0-34.121122-3.323699-79.70532-5.907547-2.863211 139.762137-25.734104 229.17147-73.224722 252.895801L715.285404 774.186398c10.866489-1.497097 19.332301-10.399861 19.332301-21.680788l0-22.044062c0-12.310374-9.911744-22.274306-22.223141-22.274306l-48.732911 0c-12.310374 0-22.222117 9.991562-22.222117 22.274306l0 22.044062c0 11.279904 8.468882 20.183691 19.332301 21.680788l0 148.182924c-47.490617-23.724331-70.385047-113.133663-73.224722-252.895801-45.579081 2.603291-79.704296 5.907547-79.704296 5.907547-50.605561 0-91.644233 41.019229-91.644233 91.607394l0 116.067482c0 50.639331 141.979642 73.330122 274.903024 73.330122 132.872217 0 268.766256-22.690792 268.766256-73.330122L959.867866 766.988462C959.84126 716.400297 918.829194 675.381068 868.215446 675.381068L868.215446 675.381068 868.215446 675.381068zM687.980525 674.482605c64.936965 0 164.930353-84.868923 164.930353-197.683315 0-109.00053-74.000388-197.658755-164.930353-197.658755-90.88187 0-164.877141 88.685855-164.877141 197.658755C523.102361 589.614705 623.116215 674.482605 687.980525 674.482605L687.980525 674.482605 687.980525 674.482605zM564.73148 432.6907c4.285606-7.17747 9.036817-14.32731 13.577227-20.572548 13.06148-17.937534 23.747867-35.951817 50.537 0 25.13854 33.789571 119.812783 52.733015 187.024557 54.874795 0.153496 3.276626 0.38681 6.529717 0.38681 9.807367 0 87.341231-78.773088 161.107281-128.302131 161.107281-49.480948 0-128.255059-73.766051-128.255059-161.107281C559.726489 461.494723 561.581744 446.733531 564.73148 432.6907L564.73148 432.6907 564.73148 432.6907zM307.02307 568.477292l-57.661258-42.429345 118.058836-118.031207L367.420649 216.629829l75.237565 0 0 216.216413L307.02307 568.477292zM672.235936 200.083991C595.656817 98.260931 464.363562 44.36851 331.593675 72.888054 149.420613 112.01826 33.455461 291.379277 72.585667 473.573829c29.937846 139.39784 142.035924 240.060471 274.700409 262.076904l52.190663-74.770937c-117.981065-1.216711-223.62515-83.733053-249.436002-203.928552-29.936823-139.376351 58.798151-276.661064 198.202131-306.577421 92.864014-19.952424 184.791703 12.803607 244.651023 78.102822L672.235936 200.083991 672.235936 200.083991 672.235936 200.083991zM672.235936 200.083991" />
                            </svg>
                        </div>
                        <div className="mt-[14px] text-center">
                            {taskPunctuality !== null && (
                                <span className="text-[#224470] font-bold text-[30px] h-[40px]">
                                    {durationTask}
                                </span>
                            )}
                            {taskPunctuality === null && (
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
                            {taskPunctuality !== null &&
                                taskPunctuality === 0 && (
                                    <span className="bg-red-100 text-red-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                        Poor
                                    </span>
                                )}
                            {taskPunctuality === 1 && (
                                <span className="bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    Good
                                </span>
                            )}
                            {taskPunctuality === 2 && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Excellent
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Documentation
                            </h3>
                            <PencilLine className="text-[#008DDA]" size={26} />
                        </div>
                        {evaluationDoc === null ? (
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mt-7 block text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
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
                        ) : (
                            <div>
                                <div className="mt-[14px]">
                                    <h3 className="text-[#344767] font-medium ">
                                        {evaluationDoc === null
                                            ? "Enter a ranting"
                                            : "Change a ranting"}
                                    </h3>
                                </div>
                                <ul className="flex justify-around mt-5">
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleDocs(0);
                                                setEvaluationDoc(0);
                                            }}
                                            className={` ${
                                                evaluationDoc == 0 &&
                                                "bg-red-600 text-white"
                                            } bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300`}
                                        >
                                            Poor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleDocs(1);
                                                setEvaluationDoc(1);
                                            }}
                                            className={` ${
                                                evaluationDoc == 1 &&
                                                "bg-yellow-600 text-white"
                                            } bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                                        >
                                            Good
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleDocs(2);
                                                setEvaluationDoc(2);
                                            }}
                                            className={` ${
                                                evaluationDoc == 2 &&
                                                "bg-green-600 text-white"
                                            } bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
                                        >
                                            Excellent
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Unit tests
                            </h3>
                            <FlaskConical
                                className="text-[#008DDA]"
                                size={26}
                            />
                        </div>
                        {evaluationTest === null ? (
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mt-7 block text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
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
                        ) : (
                            <div>
                                <div className="mt-[14px]">
                                    <h3 className="text-[#344767] font-medium ">
                                        {evaluationTest === null
                                            ? "Enter a ranting"
                                            : "Change a ranting"}
                                    </h3>
                                </div>
                                <ul className="flex justify-around mt-5">
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskTest(0);
                                                setEvaluationTest(0);
                                            }}
                                            className={` ${
                                                evaluationTest == 0 &&
                                                "bg-red-600 text-white"
                                            } bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300`}
                                        >
                                            Poor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskTest(1);
                                                setEvaluationTest(1);
                                            }}
                                            className={` ${
                                                evaluationTest == 1 &&
                                                "bg-yellow-600 text-white"
                                            } bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                                        >
                                            Good
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskTest(2);
                                                setEvaluationTest(2);
                                            }}
                                            className={` ${
                                                evaluationTest == 2 &&
                                                "bg-green-600 text-white"
                                            } bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
                                        >
                                            Excellent
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Task complexity
                            </h3>
                            <GitCompareArrows
                                className="text-[#008DDA]"
                                size={26}
                            />
                        </div>
                        {evaluationTest === null ? (
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mt-7 block text-gray-200 animate-spin dark:text-gray-600  fill-blue-500 "
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
                        ) : (
                            <div>
                                <div className="mt-[14px]">
                                    <h3 className="text-[#344767] font-medium ">
                                        {evaluationTest === null
                                            ? "Enter a ranting"
                                            : "Change a ranting"}
                                    </h3>
                                </div>
                                <ul className="flex justify-around mt-5">
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskComplexity(0);
                                                setEvaluationComplexit(0);
                                            }}
                                            className={` ${
                                                evaluationComplexit == 0 &&
                                                "bg-red-600 text-white"
                                            } bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300`}
                                        >
                                            Poor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskComplexity(1);
                                                setEvaluationComplexit(1);
                                            }}
                                            className={` ${
                                                evaluationComplexit == 1 &&
                                                "bg-yellow-600 text-white"
                                            } bg-yellow-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                                        >
                                            Good
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleTaskComplexity(2);
                                                setEvaluationComplexit(2);
                                            }}
                                            className={` ${
                                                evaluationComplexit == 2 &&
                                                "bg-green-600 text-white"
                                            } bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
                                        >
                                            Excellent
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    } else {
        return <Loading />;
    }
}
