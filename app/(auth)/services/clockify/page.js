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
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";

import Loading from "@/components/component/Loading";

import {
    getClockifyUserData,
    getClockifyWorkSpaces,
} from "@/app/api_services/actions/clockifyActions";
import { Input } from "@/components/ui/input";
import { addCookies } from "@/app/api_services/actions/handleCookies";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

function ClockifyPage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState();
    const [keyValid, setKeyValid] = useState();
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceNameSelected, setWorkspaceNameSelected] = useState("");
    const [firebaseWorkspace, setFirebaseWorkspace] = useState();
    const [keySelected, setKeySelected] = useState(null);
    const [userData, setUserData] = useState({});
    const apiKeyRef = useRef();
    const { toast } = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDocument("userData", user?.uid).then((response) => {
                    setUserData({ ...user, ...response.result.data() });
                });
            }
        });
    }, []);

    useEffect(() => {
        console.log("key : ", keySelected);

        const addKeySelected = async () => {
            if (keySelected !== null) {
                const response = await updateDocumentA({
                    collectionName: "userData",
                    id: userData?.uid,
                    data: { ClockifyWorkspace: keySelected },
                });
                if (response?.error) {
                    console.log(response?.error);
                    return;
                }
                addCookies("ClockifyWorkspace", keySelected);
                console.log(keySelected);
                toast({
                    description: "workspace is valid",
                });
            }
        };
        addKeySelected();
    }, [keySelected]);

    async function checkApiKey() {
        const apiKey = apiKeyRef.current?.value;
        try {
            if (!apiKey) {
                toast({
                    variant: "destructive",
                    description: "api key required!",
                });
                return;
            }
            const result = await getClockifyUserData(apiKey);

            setKeyValid(true);
            toast({
                description: "key is valid ,choose workspace",
            });
            addCookies("clockifyUserId", result?.id);
            addCookies("clockifyApiKey", apiKey);
            await updateDocumentA({
                collectionName: "userData",
                id: userData?.uid,
                data: { clockifyApiKey: apiKey, clockifyUserId: result?.id },
            });

            const spacesResponse = await getClockifyWorkSpaces();
            setWorkspaces(spacesResponse);
        } catch (error) {
            console.log( error.message);
            toast({
                variant: "destructive",
                description: error.message,
            });
        }
    }
    console.log("spacesResponse", workspaces);

    console.log(userData);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Clockify
            </h1>
            <ul className="text-lg text-gray-800 list-none space-y-2 mb-8">
                <li className="flex flex-col  mb-9">
                    <div className="flex py-3">
                        <CheckCircle2
                            className={`h-6 w-6 sm:h-9 sm:w-9 ${
                                keyValid ? "text-green-600" : "text-gray-500"
                            } mr-2`}
                        />{" "}
                        {/* "DONE" icon */}
                        <span
                            className={`${
                                keyValid ? "text-green-600" : "text-gray-500"
                            } text-[15px] sm:text-[25px] font-semibold`}
                        >
                            Api-key is integrated
                        </span>
                    </div>
                    <div className="ml-10">
                        <Input type="text" className="m-0" ref={apiKeyRef} />
                        <Link
                            className="text-[12px] text-blue-700"
                            href="https://app.clockify.me/user/settings"
                            target="_blank"
                        >
                            https://app.clockify.me/user/settings
                        </Link>
                        <div className="flex">
                            <Button
                                onClick={checkApiKey}
                                className={`mt-1 w-[120px] sm:w-[160px]  `}
                            >
                                save api key
                            </Button>
                        </div>
                    </div>
                </li>
                <li className="flex items-center mt-5">
                    <CheckCircle2
                        className={`${
                            workspaceNameSelected
                                ? "text-green-500"
                                : "text-gray-500"
                        } h-6 w-6 sm:h-9 sm:w-9  mr-2`}
                    />{" "}
                    {/* "DONE" icon */}
                    <span
                        className={`${
                            workspaceNameSelected
                                ? "text-green-600"
                                : "text-gray-600"
                        }  text-[15px] sm:text-[25px] font-semibold`}
                    >
                        Choose the workspace you are working in :
                    </span>
                </li>
                <li className="mt-1 mb-1 ml-[40px]">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className={` mt-1 w-[130px] sm:w-[160px] `}
                                disabled={!keyValid}
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

                                            {workspaces.length > 0 &&
                                                workspaces?.map((workspace) => (
                                                    <div
                                                        key={workspace?.name}
                                                        
                                                    >
                                                        <p
                                                            onClick={() => {
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
                        className={` text-[20px]  font-semibold mt-9`}
                        disabled={!keySelected}
                        onClick={() => router.push("/services")}
                    >
                        submit
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default ClockifyPage;
