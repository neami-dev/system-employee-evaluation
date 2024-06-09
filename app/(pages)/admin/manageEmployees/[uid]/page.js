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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { addDays } from "date-fns";

import { DateRange } from "react-day-picker";
import { Clock3, Speech, CalendarIcon, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import addDocumentById from "@/firebase/firestore/addDocumentById";

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
    const defaultHourInWeekEnd = 15;
    const numberCommit = 3;
    const defaultScore = 1;
    const hoursWork = 8;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedDate = format(yesterday, "yyyy-MM-dd");
    const [date, setDate] = useState(formattedDate);
    const [dateHolidy, setDateHolidy] = useState({
        from: new Date(),
        to: addDays(new Date(), 10),
    });
    const [currentHoliday, setCurrentHoliday] = useState(null);

    // the function handle the date selected
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
            const getuserData = async () => {
                const responseHoliday = getDocument("holidays", uid);
                setCurrentHoliday((await responseHoliday)?.result?.data());
            };
            getuserData();
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
            Promise.allSettled([getClosedTask(), getRejectedTask()]);
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    useEffect(() => {
        Promise.allSettled([
            hanldeTatalCommit(),
            handleTimeWorking(),
            getAttributes(),
        ]);
    }, [date]); //rendering when change date

    useEffect(() => {
        handleTaskPunctuality();
        getMethodologyOfWork();
    }, [tasks, taskSelected]); //rendering when change tasks, taskSelected

    // return evaluation comminucation and evaluation Respect 3T from firebase
    const getAttributes = async () => {
        const response = await getDocument("attributes", uid);
        const attributes = response?.result?.data();
        const evaluationComminu = attributes?.communication[date];
        const evaluationRespect = attributes?.respectWork[date];

        setEvaluationComminu(evaluationComminu);
        setRespectWork(evaluationRespect);

        return { evaluationComminu, evaluationRespect };
    };

    // return evaluation Documentation and evaluation Unit tests from firebase
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

        setEvaluationComplexit(complexity);
    };

    // return the tasks are closed from clickup
    const getClosedTask = async () => {
        const response = await getDocument("userData", uid);
        const clickupTeamID = response?.result?.data()?.clickupTeam;
        const clickupUserID = response?.result?.data()?.clickupUser;
        const responseTasks = await getClosedTasksByEmployee(
            clickupTeamID,
            clickupUserID
        );

        if (responseTasks !== null) {
            setTasks(responseTasks);
            // default task
            settaskSelected(responseTasks[0]);
        }
    };

    // return the tasks are rejected from clickup
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

    // the function calculate time consumed in the task selected and return evaluation
    const handleTaskPunctuality = () => {
        let evaluation = 0;
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
    };

    // the function calculate the time spent at work in day selected and return evaluation
    const handleTimeWorking = async () => {
        try {
            const response = await getDocument("userData", uid);
            const responseHoliday = await getDocument("holidays", uid);
            const workspaceId = response?.result.data()?.clockifyWorkspace;
            const clockifyUserId = response?.result.data()?.clockifyUserId;

            const dailyEntries = await getCheckInOutTimes(
                clockifyUserId,
                workspaceId,
                date
            );

            const isInHoliday = () => {
                return (
                    responseHoliday.result.data()?.from <= date &&
                    responseHoliday.result.data()?.to >= date
                );
            };

            const isWeekend = () => {
                const day = new Date(date).getDay();
                return day === 0 || day === 6;
            };

            const formattedDate = format(today, "yyyy-MM-dd");

            if (dailyEntries === null && isWeekend()) {
                setTime(false);
                setStatusTime("inWeekend");
                return 1;
            }

            if (dailyEntries === null && isInHoliday()) {
                setTime(false);
                setStatusTime("inHoliday");
                return 1;
            }
            if (dailyEntries === null && !isWeekend() && !isInHoliday()) {
                setTime(false);
                setStatusTime("absent");
                return 0;
            }
            if (dailyEntries?.checkOutTime == "In progress") {
                setTime(false);
                setStatusTime("inProgress");
                return 1;
            }

            if (dailyEntries?.checkOutTime) {
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

                if (isWeekend()) {
                    if (hours >= defaultHourInWeekEnd) {
                        return 2;
                    }
                    setStatusTime("inWeekend");
                    return 1;
                }
                if (isInHoliday()) {
                    if (hours >= defaultHourInWeekEnd) {
                        return 2;
                    }
                    setStatusTime("inHoliday");
                    return 1;
                }

                if (hours > hoursWork) {
                    setStatusTime("present");
                    return 2;
                }
                if (hours == hoursWork) {
                    setStatusTime("present");
                    return 1;
                }
                if (hours < hoursWork) {
                    setStatusTime("present");
                    return 0;
                }
            }

            return 0;
        } catch (error) {
            console.error(error.message);
        }
    };

    // the function calculate the total commit in day selected and return evaluation
    const hanldeTatalCommit = async () => {
        try {
            let evaluation = null;
            const responseEmp = await getDocument("userData", uid);
            if (!responseEmp?.result?.data()) {
                return toast({
                    description: "error",
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
        if (statusTime == "absent") {
            toast({
                description: "the employee is absent",
                variant: "destructive",
            });
            return;
        }
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
        if (statusTime == "absent") {
            toast({
                description: "the employee is absent",
                variant: "destructive",
            });
            return;
        }
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
    console.log(currentHoliday);
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
    const calculateEvaluationAttibuts = async () => {
        const responseWorkTime = await handleTimeWorking();
        const responseTotalCommit = await hanldeTatalCommit();
        await getAttributes();
        let evaluation = 0;
        console.log(responseWorkTime, responseTotalCommit);

        // Set default values if undefined or null
        const finalRespectWork =
            respectWork === undefined || respectWork === null
                ? defaultScore
                : respectWork;
        const finalEvaluationComminu =
            evaluationComminu === undefined || evaluationComminu === null
                ? defaultScore
                : evaluationComminu;

        if (statusTime !== "absent") {
            evaluation =
                ((responseWorkTime +
                    responseTotalCommit +
                    finalEvaluationComminu +
                    finalRespectWork) *
                    100) /
                8;
        }
        if (statusTime == "inHoliday" || statusTime == "inWeekend") {
            evaluation =
                ((responseWorkTime +
                    responseTotalCommit +
                    defaultScore +
                    defaultScore) *
                    100) /
                8;
        }
        console.log(evaluation);
        console.log("date==", date);
        const response = await setDocumment({
            collectionName: "evaluation",
            id: uid,
            data: { attributes: { [date]: evaluation } },
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
    const calculateEvaluationMethodologyWork = async () => {
        const responseTaskPunctuality = await handleTaskPunctuality();
        const finalEvaluationDoc =
            evaluationDoc === undefined || evaluationDoc === null
                ? defaultScore
                : evaluationDoc;
        const finalEvaluationTest =
            evaluationTest === undefined || evaluationTest === null
                ? defaultScore
                : evaluationTest;
        const finalEvaluationComplexit =
            evaluationComplexit === undefined || evaluationComplexit === null
                ? defaultScore
                : evaluationComplexit;

        const evaluation =
            ((responseTaskPunctuality +
                finalEvaluationDoc +
                finalEvaluationTest +
                finalEvaluationComplexit) *
                100) /
            8;

        console.log(evaluation);
        const response = await setDocumment({
            collectionName: "evaluation",
            id: uid,
            data: { methodologyOfWork: { [taskSelected?.id]: evaluation } },
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
    // (end) functions save evaluations in firebase

    const bookAHoliday = async () => {
        if (!dateHolidy) {
            return toast({
                description: "choose the time !",
                variant: "destructive",
            });
        }
        if (!dateHolidy?.from) {
            return toast({
                description: "choose a start time !",
                variant: "destructive",
            });
        }
        if (!dateHolidy?.to) {
            return toast({
                description: "choose an end time !",
                variant: "destructive",
            });
        }

        const from = format(dateHolidy?.from, "yyyy-MM-dd");
        const to = format(dateHolidy?.to, "yyyy-MM-dd");

        const response = await addDocumentById({
            collectionName: "holidays",
            id: uid,

            data: {
                from,
                to,
            },
        });
        console.log(response.error);
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

    return (
        <div className="mt-[140px] w-[92%] mx-auto min-[426px]:w-[72%] min-[426px]:ml-[100px] sm:w-[80%] sm:ml-[100px] md:ml-[124px] lg:w-[82%] lg:ml-[135px]  xl:w-[85%] xl:ml-[145px]">
            <div className="flex  items-center min-[550px]:justify-between flex-wrap min-[550px]:flex-nowrap gap-3 my-3 mt-6">
                <h3 className="ml-2 text-[14px] min-[550px]:text-[18px] font-medium sm:font-semibold text-[#453F78]">
                    Attributs
                </h3>
                <div className="w-full min-[550px]:w-fit flex justify-center min-[550px]:justify-end gap-3 items-center">
                    <Button
                        className="w-[100px] h-[37px] lg:w-[160px] flex items-center justify-center gap-x-2 bg-[#dddee4] hover:bg-[#bec0c6] px-2 text-[14px] text-[#453F78] "
                        onClick={calculateEvaluationAttibuts}
                        disabled={statusTime === "inProgress"}
                    >
                        Save <span className="hidden lg:block">evaluation</span>
                        <Check size={15} />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="w-[160px] px-3 py-2 bg-white text-[#453F78] text-[14px] font-medium items-center  flex rounded-md">
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
            </div>
            <section>
                <div className=" p-2 flex justify-around flex-wrap gap-3 lg:flex-nowrap">
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3  flex-col">
                        <div className="flex w-full justify-around  items-center">
                            <h3 className="text-[#344767] font-semibold ">
                                Working time
                            </h3>
                            <Clock3 className="text-[#008DDA]" size={26} />
                        </div>
                        <div className="mt-[14px] text-center ">
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
                            {time !== null && (
                                <p className="text-[#224470] font-bold text-[30px]">
                                    {time}
                                </p>
                            )}
                        </div>
                        <div className="mt-2">
                            {statusTime == "absent" && (
                                <span className="bg-red-100 text-red-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    Absent
                                </span>
                            )}
                            {statusTime == "inWeekend" && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                    In Weekend
                                </span>
                            )}
                            {statusTime == "present" && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Present
                                </span>
                            )}

                            {statusTime == "inProgress" && (
                                <span className="bg-orange-100 text-orange-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">
                                    In Progress
                                </span>
                            )}
                            {statusTime == "inHoliday" && (
                                <span className="bg-blue-100 text-blue-800 w-[60px] text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    In holiday
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
                    <div className="bg-white w-[220px] h-[200px] rounded-md shadow-md py-6 flex items-center gap-3   flex-col">
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
                                                statusTime !== "absent" &&
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
                                                statusTime !== "absent" &&
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
                                                statusTime !== "absent" &&
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
                                                statusTime !== "absent" &&
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
                                                statusTime !== "absent" &&
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
                                                statusTime !== "absent" &&
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
                </div>
            </section>
            <div className="flex  items-center min-[550px]:justify-between flex-wrap min-[550px]:flex-nowrap gap-3 mt-10">
                <h3 className="ml-2 text-[14px] min-[550px]:text-[18px] font-medium sm:font-semibold text-[#453F78]">
                    Methodology of work
                </h3>
                <div className="w-full min-[550px]:w-fit flex justify-center min-[550px]:justify-end gap-3 my-3 items-center">
                    {statusTime !== "inProgress" && (
                        <Button
                            className="w-[100px] h-[37px] lg:w-[160px] flex items-center justify-center gap-x-2 bg-[#dddee4] hover:bg-[#bec0c6] px-2 text-[14px] text-[#453F78] "
                            onClick={calculateEvaluationMethodologyWork}
                        >
                            Save{" "}
                            <span className="hidden lg:block">evaluation</span>
                            <Check size={15} />
                        </Button>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-[130px] sm:w-[160px] justify-between  text-[14px] font-medium sm:font-semibold text-[#453F78]"
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
                                    <>
                                        <span className="sm:hidden">
                                            {taskSelected?.name.slice(0, 10)}
                                        </span>
                                        <span className="hidden sm:block">
                                            {taskSelected?.name?.length > 15 ? (
                                                <span>
                                                    {taskSelected?.name?.slice(
                                                        0,
                                                        13
                                                    )}
                                                    ..
                                                </span>
                                            ) : (
                                                taskSelected?.name
                                            )}
                                        </span>
                                        <span className="sm:hidden">..</span>
                                    </>
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
            </div>
            <section>
                <div className=" p-2 flex justify-around flex-wrap gap-3  lg:flex-nowrap">
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
                                            Simple
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
                                            Medium
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
                                            Complex
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <div className="p-6 my-9 w-full ">
                <h3 className=" ml-2 my-4 text-[14px] min-[550px]:text-[18px] font-medium sm:font-semibold text-[#453F78]  ">
                    Holiday
                </h3>
                <div className=" bg-white shadow-sm p-6 rounded-xl">
                    <div className=" py-6 text-[#999] text-center ">
                        {currentHoliday ? (
                            <h3>
                                current holiday from{" "}
                                <span className="text-[#3e3d3d]">
                                    {currentHoliday?.from}
                                </span>{" "}
                                to{" "}
                                <span className="text-[#3e3d3d]">
                                    {currentHoliday?.to}
                                </span>
                            </h3>
                        ) : (
                            <h3>There is no holiday</h3>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-7">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    className={cn(
                                        "w-[300px] bg-[#eeefef] hover:bg-[#dfdede] text-[#333] justify-start text-left font-normal",
                                        !dateHolidy && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateHolidy?.from ? (
                                        dateHolidy.to ? (
                                            <>
                                                {format(
                                                    dateHolidy.from,
                                                    "LLL dd, y"
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    dateHolidy.to,
                                                    "LLL dd, y"
                                                )}
                                            </>
                                        ) : (
                                            format(dateHolidy.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateHolidy?.from}
                                    selected={dateHolidy}
                                    onSelect={setDateHolidy}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button
                            className="w-[100px] h-[37px] lg:w-[160px] flex items-center justify-center gap-x-2 bg-[#dddee4] hover:bg-[#bec0c6] px-2 text-[14px] text-[#453F78] "
                            onClick={bookAHoliday}
                        >
                            Save
                            <Check size={15} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
