"use client";
import { getClockifyWorkSpaces } from "@/app/api_services/actions/clockifyActions";
import { getGitHubUserRepos } from "@/app/api_services/actions/githubActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { auth } from "@/firebase/firebase-config";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import getDocument from "@/firebase/firestore/getDocument";
import { editEmail } from "@/firebase/firebase-admin/editEmail";
import { onAuthStateChanged } from "firebase/auth";
import { updateEmployee } from "@/firebase/firebase-admin/updateEmployee";
import { test } from "@/firebase/firebase-admin/test";
import { sendVerifyResetPsw } from "@/firebase/auth/sendVerifyResetPsw";
import { useToast } from "@/components/ui/use-toast";

export default function page() {
    const route = useRouter();
    const [repos, setRepos] = useState([]);
    const [repoSelected, setRepoSelected] = useState({});
    const [workspaces, setWorkspaces] = useState([]);
    const newFullNameRef = useRef();
    const newEmailRef = useRef();

    const [keySelected, setKeySelected] = useState(null);
    const [userData, setUserData] = useState({});
    const [isLogged, setIsLogged] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogged(true);
                getDocument("userData", user?.uid).then((response) => {
                    setUserData({ ...user, ...response.result.data() });
                });
            } else {
                route.push("/login");
            }
        });
        const getRepos = async () => {
            const response = await getGitHubUserRepos();
            setRepos(response);
            // console.log("repos", response);
        };
        getRepos();
        // const getyWorkSpaces = async () => {
        //     const response = await getClockifyWorkSpaces();
        //     setWorkspaces(response);
        //     console.log("workspaces", response);
        // };
        // getyWorkSpaces();
    }, []);

    const handleInfoChange = async (e) => {
        e.preventDefault();
        const newEmail = newEmailRef.current.value;
        const newFullName = newFullNameRef.current.value;
        
        // const password = "123456";
        console.log(newFullName);
        if (newEmail && userData) {
            updateEmployee({ uid: userData?.uid, email: newEmail });
        }
        if (newFullName && userData) {
            console.log("uid", userData?.uid);

            const response = await updateEmployee({
                uid: userData?.uid,
                displayName: newFullName,
            });
            console.log(response, userData);
        }
    };
    // send verifiction set password in email
    const handleSendVerification = async () => {
        if (userData) {
            const response = await sendVerifyResetPsw("fodaly@imagepoet.net");
            console.log(response);
            if (response.error === null) {
                toast({
                    description: "Sccessfully to send verification",
                });
            } else {
                toast({
                    variant: "destructive",
                    description: "Error to send verification !",
                });
            }
        }
    };
    if (isLogged) {
        return (
            <>
                <section className="w-[90%] m-auto mt-32 min-[426px]:w-[76%] min-[426px]:ml-[86px] sm:w-[78%] sm:ml-[130px] md:w-[80%] xl:ml-[160px]  ">
                    <div>
                        <h3 className="text-[#212b36]">General Setting</h3>
                        <p className="text-[#637381] mb-6">
                            Profile configuration settings
                        </p>
                    </div>
                    <div className="bg-white rounded-lg py-2 px-6">
                        <h3 className="text-[#212b36] my-3">
                            Basic information
                        </h3>
                        <ul className="flex items-center justify-around  w-[100%]">
                            <li className="text-[#212b36] relative w-[40%] ">
                                <h3 className=" absolute left-[30%] hidden sm:block">
                                    Avatar
                                </h3>
                            </li>

                            <li className="flex items-center justify-around w-[100%] sm:w-[60%]">
                                <Avatar className=" border-2 w-[60px] h-[60px] md:w-[70px] md:h-[70px] ">
                                    <AvatarImage
                                        alt="User"
                                        src={userData?.photoURL}
                                    />
                                    <AvatarFallback className="capitalize font-bold text-3xl">
                                        {userData?.displayName?.split("")[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex ml-3 gap-2">
                                    <button className="border-2 px-3 py-1 rounded-lg">
                                        change
                                    </button>
                                    <button className="border-2 px-3 py-1 rounded-lg">
                                        remove
                                    </button>
                                </div>
                            </li>
                        </ul>

                        <form className="">
                            <div className="mt-8 ">
                                {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                                <div className="rounded-md flex flex-col items-end justify-end ">
                                    <div className=" w-[100%] mx-auto flex">
                                        <label
                                            htmlFor="full-name"
                                            className="w-[40%] relative hidden sm:block"
                                        >
                                            <span className=" absolute left-[30%]">
                                                {" "}
                                                Full Name
                                            </span>
                                        </label>

                                        <input
                                            id="full-name"
                                            name="fullName"
                                            type="username"
                                            required
                                            className="rounded relative block w-full sm:w-[60%]  px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="New Full Name"
                                            ref={newFullNameRef}
                                        />
                                    </div>

                                    <div className="w-[100%] mx-auto  flex">
                                        <label
                                            htmlFor="email-address"
                                            className="w-[40%] relative hidden sm:block"
                                        >
                                            <span className="absolute left-[30%]">
                                                New Email address
                                            </span>
                                        </label>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className=" rounded relative block w-full sm:w-[60%] px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="New  Email address"
                                            ref={newEmailRef}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleInfoChange}
                                        className="mt-6 w-[160px]"
                                    >
                                        save change
                                    </Button>
                                    <div className="w-[100%] mx-auto  flex items-center justify-between">
                                        <label className="w-[40%] relative hidden sm:block">
                                            <span className="absolute left-[30%]">
                                                set Password
                                            </span>
                                        </label>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="mt-6 w-[160px]"
                                                >
                                                    set Password
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Set password
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        By clicking "Set
                                                        Password", an email will
                                                        be sent to{" "}
                                                        {userData?.email} for
                                                        password setup.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={
                                                            handleSendVerification
                                                        }
                                                    >
                                                        Set password
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* <div className="bg-white rounded-lg py-2 px-6">
                        <h3 className="text-[#212b36] my-3">
                            Basic information
                        </h3>
                        <form className="">
                            <div className="mt-8 ">
                                // {/* <input type="hidden" name="remember" defaultValue="true" /> 
                                <div className="rounded-md flex flex-col items-end justify-end ">
                                    <div className=" w-[100%] mx-auto flex">
                                        <label
                                            htmlFor="full-name"
                                            className="w-[40%] relative hidden sm:block"
                                        >
                                            <span className=" absolute left-[30%]">
                                                {" "}
                                                Full Name
                                            </span>
                                        </label>

                                        <input
                                            id="full-name"
                                            name="fullName"
                                            type="username"
                                            required
                                            className="rounded relative block w-full sm:w-[60%]  px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="New Full Name"
                                            // ref={newFullNameRef}
                                        />
                                    </div>

                                    <div className="w-[100%] mx-auto  flex">
                                        <label
                                            htmlFor="whoIAm"
                                            className="w-[40%] relative hidden sm:block"
                                        >
                                            <span className="absolute left-[30%]">
                                                who I am
                                            </span>
                                        </label>
                                        <textarea
                                            id="whoIAm"
                                            name="whoIAm"
                                            type="textArea"
                                            required
                                            className=" rounded relative block w-full sm:w-[60%] px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="who I am"
                                        />
                                    </div>

                                    <Button
                                        // onClick={handleInfoChange}
                                        className="mt-6 w-[160px]"
                                    >
                                        save change
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div> */}
                    <div className="bg-white rounded-lg  p-4 my-4">
                        <h3>changing your workspace in clickUp</h3>

                        <Button
                            onClick={() =>
                                route.push(
                                    `https://app.clickup.com/api?client_id=${process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID}&redirect_uri=http://localhost:3000/api/clickupAuth`
                                )
                            }
                            className="mt-6 w-[160px] gap-x-3 "
                        >
                            change workspace
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg  p-4 my-4">
                        <h3>changing your workspace in clockify</h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-6 w-[160px]">
                                    change workspace
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit workspace</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <ScrollArea className="h-[200px] w-full rounded-md border">
                                        <div className="p-4">
                                            <h4 className="mb-4 text-sm font-medium leading-none">
                                                workspace
                                            </h4>
                                            <hr />

                                            {/* {workspaces !== undefined &&
                                                workspaces?.map((workspace) => (
                                                    <div
                                                        key={workspace?.name}
                                                        className=""
                                                    >
                                                        <p
                                                            onClick={() => {
                                                                console.log(
                                                                    workspace
                                                                );
                                                                setRepoSelected(
                                                                    workspace
                                                                );
                                                                setKeySelected(
                                                                    workspace?.name
                                                                );
                                                            }}
                                                            className={`text-sm cursor-pointer ${
                                                                workspace?.name ==
                                                                    keySelected &&
                                                                "bg-[#b4b5b6]"
                                                            } hover:bg-[#ddd]  p-2 my-1 rounded-lg`}
                                                        >
                                                            {workspace?.name}
                                                        </p>
                                                        <hr />
                                                    </div>
                                                ))} */}
                                        </div>
                                    </ScrollArea>
                                </div>
                                <DialogFooter>
                                    <Button>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="bg-white rounded-lg  p-4 my-4">
                        <h3>changing your repositorie in github</h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-6 w-[160px]">
                                    change repositorie
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit repositorie</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <ScrollArea className="h-[200px] w-full rounded-md border">
                                        <div className="p-4">
                                            <h4 className="mb-4 text-sm font-medium leading-none">
                                                repos
                                            </h4>
                                            <hr />

                                            {repos !== undefined &&
                                                repos?.map((repo, index) => (
                                                    <div
                                                        key={index}
                                                        className=""
                                                    >
                                                        <p
                                                            onClick={() => {
                                                                console.log(
                                                                    repo
                                                                );
                                                                setRepoSelected(
                                                                    repo
                                                                );
                                                                setKeySelected(
                                                                    index
                                                                );
                                                            }}
                                                            className={`text-sm cursor-pointer ${
                                                                index ==
                                                                    keySelected &&
                                                                "bg-[#b4b5b6]"
                                                            } hover:bg-[#ddd]  p-2 my-1 rounded-lg`}
                                                        >
                                                            {repo?.name}
                                                        </p>
                                                        <hr />
                                                    </div>
                                                ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                                <DialogFooter>
                                    <Button>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
            </>
        );
    }
}
