"use client";
import { AlertOctagon, CheckCircle2, Loader, OctagonIcon } from "lucide-react";
import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase-config";
import {
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    updateEmail,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";

// import { setRepofirebaseGithub } from '@/dataManagement/firebaseWithGithub/setRepoFirebaseGithub';
import Loading from "@/components/component/Loading";
import { setWorkSpaceIdfirebaseClockify } from "@/dataManagement/firebaseWithClockify/setWorkspaceFirebaseClockify";
import { setApiKeyFirebaseClockify } from "@/dataManagement/firebaseWithClockify/setApiKeyFirebaseClockify";
import { CheckApiKeyClockify, getClockifyWorkSpaces } from "@/app/api_services/actions/clockifyActions";

function ClockifyPage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState();
    const [keyValid, setKeyValid] = useState();
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceNameSelected, setWorkspaceNameSelected] = useState();
    const [firebaseWorkspace, setFirebaseWorkspace] = useState();
    const [keySelected, setKeySelected] = useState(null);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDocument("userData", user?.uid).then((response) => {
                    setUserData({ ...user, ...response.result.data() });
                });
            }
        });
        const getyWorkSpaces = async () => {
            const response = await getClockifyWorkSpaces();
            setWorkspaces(response);
            console.log("workspaces", response);
        };
        getyWorkSpaces();
    }, []);

    useEffect(() => {
        console.log("key : ", keySelected);
        console.log("workspace : ", workspaceNameSelected);

        if (keySelected !== null) {
            auth.onAuthStateChanged((user) => {
                // setFirebaseWorkspace(setRepofirebaseGithub(workspaceNameSelected, user?.uid))
                setFirebaseWorkspace("loading");
                setWorkSpaceIdfirebaseClockify(keySelected, user?.uid)
                    .then((res) => {
                        console.log(res);
                        setFirebaseWorkspace(res.status);
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setFirebaseWorkspace(res.status);
                    });
            });
        }
    }, [keySelected]);

    // useEffect(() => {
    //     if (keyValid == true) {
    //         auth.onAuthStateChanged((user) => {
    //             // setFirebaseWorkspace(setRepofirebaseGithub(workspaceNameSelected, user?.uid))
    //             // setFirebaseWorkspace("loading")
    //             setApiKeyFirebaseClockify(user?.uid, apiKey)
    //                 .then((res) => {
    //                     console.log(res);
    //                     // setFirebaseWorkspace(res.status)
    //                 })
    //                 .catch((err) => {
    //                     console.log(err.message);
    //                     // setFirebaseWorkspace(res.status)
    //                 });
    //         });
    //     }
    // }, [keyValid]);

    // function checkApiKey(key) {
    //     setKeyValid("loader");
    //     CheckApiKeyClockify(key)
    //         .then((res) => {
    //             setKeyValid(res);
    //             console.log("answer", res);
    //         })
    //         .catch((err) => {
    //             setKeyValid(err);
    //             console.log("answer", err);
    //         });
    //     // console.log(keyValid);
    // }

    // console.log(userData);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Clockify
            </h1>
            <ul className="text-lg text-gray-800 list-none space-y-2 mb-8">
            <li className="flex items-center mb-9">
                <CheckCircle2 className="h-9 w-9 text-green-500 mr-2" />{" "}
                {/* "DONE" icon */}
                <span className="text-green-600 text-[25px] font-semibold">
                    Api-key is integrated
                </span>
            </li>
                <li className="flex items-center mt-5">
                    <CheckCircle2
                        className={`${
                            firebaseWorkspace == "OK"
                                ? "text-green-500"
                                : "text-gray-500"
                        } min-h-9 min-w-9  mr-2`}
                    />{" "}
                    {/* "DONE" icon */}
                    <span
                        className={`${
                            firebaseWorkspace == "OK"
                                ? "text-green-600"
                                : "text-gray-600"
                        }  text-[25px] font-semibold`}
                    >
                        Choose the workspace you are working in :
                    </span>
                </li>
                <li className="mt-1 mb-1 ml-[40px]">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className={`mt-1 min-w-[160px] px-3 bg-black hover:bg-black`}
                            >
                                {/* Choose repositorie */}
                                {workspaceNameSelected
                                    ? workspaceNameSelected
                                    : "Choose workspace"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Workspace</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {firebaseWorkspace == "loading" ? (
                                    <Loading />
                                ) : (
                                    <ScrollArea className="h-[200px] w-full rounded-md border">
                                        <div className="p-4">
                                            <h4 className="mb-4 text-sm font-medium leading-none">
                                                workspace
                                            </h4>
                                            <hr />

                                            {workspaces !== undefined &&
                                                workspaces?.map((workspace) => (
                                                    <div
                                                        key={workspace?.name}
                                                        className=""
                                                    >
                                                        <p
                                                            onClick={() => {
                                                                // console.log("workspace : ",workspace?.name);
                                                                setWorkspaceNameSelected(
                                                                    workspace?.name
                                                                );
                                                                setKeySelected(
                                                                    workspace?.id
                                                                );
                                                            }}
                                                            className={`text-sm cursor-pointer ${
                                                                workspace?.name ==
                                                                    workspaceNameSelected &&
                                                                "bg-[#b4b5b6]"
                                                            } hover:bg-[#ddd]  p-2 my-1 rounded-lg`}
                                                        >
                                                            {workspace?.name}
                                                        </p>
                                                        <hr />
                                                    </div>
                                                ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            console.log(
                                                "workspaceNameSelected : ",
                                                workspaceNameSelected
                                            )
                                        }
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </li>
                <li className="flex items-start justify-end mb-3">
                    <Button
                        className={`${
                            firebaseWorkspace == "OK" 
                                ? "bg-black hover:bg-black"
                                : "bg-gray-400 hover:bg-gray-400"
                        } text-[20px]  font-semibold mt-9`}
                        type="button"
                        onClick={() =>
                            firebaseWorkspace == "OK"
                                ? router.push("/services")
                                : null
                        }
                    >
                        submit
                    </Button>
                </li>
            </ul>
            {/* <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
        Choose the Repo
      </button> */}
        </div>
    );
}

export default ClockifyPage;
