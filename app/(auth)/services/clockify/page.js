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
import { addCookie, addCookieServer, getCookie } from "@/app/api_services/actions/handleCookies";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import updateDocument from "@/firebase/firestore/updateDocument";

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
        const addKeySelected = async () => {
            if (keySelected !== null) {
                const response = await updateDocument({
                    collectionName: "userData",
                    id: userData?.uid,
                    data: { clockifyWorkspace: keySelected },
                });
                console.log("res updateDocumentA",response);
                if (response?.error) {
                    console.log(response?.error);
                    return;
                }
                addCookie("clockifyWorkspace", keySelected);
                console.log("keySelected==", keySelected);
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
            if (result == null) {
                toast({
                    variant: "destructive",
                    description: "api key is not valid",
                });
                return;
            }
            console.log(result);
            setKeyValid(true);
            toast({
                description: "key is valid ,choose workspace",
            });
            addCookie("clockifyUserId", result?.id);
            addCookieServer("clockifyApiKey", apiKey);

            await updateDocumentA({
                collectionName: "userData",
                id: userData?.uid,
                data: { clockifyApiKey: apiKey, clockifyUserId: result?.id },
            });

            const spacesResponse = await getClockifyWorkSpaces(apiKey);
            console.log("spacesResponse===", spacesResponse);
            setWorkspaces(spacesResponse);
        } catch (error) {
            console.log(error.message);
            toast({
                variant: "destructive",
                description: "api key is not valid",
            });
        }
    }

    // console.log(userData);

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

                                            {workspaces.length > 0 ? (
                                                workspaces?.map((workspace) => (
                                                    <div key={workspace?.name}>
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
                                                ))
                                            ) : (
                                                <div
                                                    role="status"
                                                    className="flex justify-center mt-16"
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
                                                    <span className="sr-only">
                                                        Loading...
                                                    </span>
                                                </div>
                                            )}
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
                        onClick={() => {
                            if (userData?.emailVerified) {
                                router.push("/employee/dashboard");
                            } else {
                                router.push("/services");
                            }
                        }}
                    >
                        submit
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default ClockifyPage;
