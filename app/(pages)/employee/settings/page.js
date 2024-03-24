"use client";
import { getClockifyWorkSpaces } from "@/app/api/actions/clockifyActions";
import { getGitHubUserRepos } from "@/app/api/actions/githubActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "@/firebase/firebase-config";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function page() {
    const route = useRouter();
    const [repos, setRepos] = useState([]);
    const [repoSelected, setRepoSelected] = useState({});
    const [workspaces, setWorkspaces] = useState([]);
    const newFullNameRef = useRef();
    const newEmailRef = useRef();
    const newPasswordRef = useRef();
    const [keySelected, setKeySelected] = useState(null);

    useEffect(() => {  
         
        const getRepos = async () => {
            const response = await getGitHubUserRepos();
            setRepos(response);
            console.log("repos", response);
        };
        getRepos();
        const getyWorkSpaces = async () => {
            const response = await getClockifyWorkSpaces();
            setWorkspaces(response);
            // console.log("workspaces", response);
        };
        getyWorkSpaces();
    }, []);
    const handleInfoChange = async (e) => {
        e.preventDefault();
        const newEmail = newEmailRef.current.value;
        const newFullName = newFullNameRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const password = "123456";
        console.log(newEmail);
        if (newEmail !== undefined) {
            const user = auth.currentUser;
            const actionCodeSettings = {
                url: "https://www.example.com/?email=user@example.com",
                iOS: {
                    bundleId: "com.example.ios",
                },
                android: {
                    packageName: "com.example.android",
                    installApp: true,
                    minimumVersion: "12",
                },
                handleCodeInApp: true,
            };

            try {
                // Reauthenticate user

                await verifyBeforeUpdateEmail(
                    user,
                    newEmail,
                    actionCodeSettings
                ).then((res) => console.log(res));
                // Update email
                // await updateEmail(user, newEmail);
                // console.log("Email updated successfully");
            } catch (error) {
                console.error("Error reauthenticating:", error.message);
                return { success: false, error: error.message };
            }
        }
    };
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
                    <h3 className="text-[#212b36] my-3">Basic information</h3>
                    <ul className="flex items-center justify-around  w-[100%]">
                        <li className="text-[#212b36] relative w-[40%] ">
                            <h3 className=" absolute left-[30%] hidden sm:block">
                                Avatar
                            </h3>
                        </li>

                        <li className="flex items-center justify-around w-[100%] sm:w-[60%]">
                            <Avatar className=" border-2 w-[60px] h-[60px] md:w-[70px] md:h-[70px] ">
                                <AvatarImage alt="User" src={``} />
                                <AvatarFallback className="capitalize font-bold text-3xl">
                                    A
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
                                <div className="w-[100%] mx-auto  flex">
                                    <label
                                        htmlFor="password"
                                        className="w-[40%] relative hidden sm:block"
                                    >
                                        <span className=" absolute left-[30%]">
                                            New Password
                                        </span>
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="rounded relative block w-full sm:w-[60%] px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="New Password"
                                        ref={newPasswordRef}
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
                </div>
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
                                        
                                        {repos !== undefined && repos?.map((repo) => (
                                            <div key={repo?.name} className="">
                                                <p
                                                    onClick={() => {
                                                        console.log(repo);
                                                        setRepoSelected(repo);
                                                        setKeySelected(
                                                            repo?.name
                                                        );
                                                    }}
                                                    className={`text-sm cursor-pointer ${
                                                        repo?.name ==
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

                                        {repos.map((repo, index) => (
                                            <div key={index} className="">
                                                <p
                                                    onClick={() => {
                                                        console.log(repo);
                                                        setRepoSelected(repo);
                                                        setKeySelected(index);
                                                    }}
                                                    className={`text-sm cursor-pointer ${
                                                        index == keySelected &&
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
