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
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import getDocument from "@/firebase/firestore/getDocument";
import { editEmail } from "@/firebase/auth/editEmail";
import { onAuthStateChanged } from "firebase/auth";

import { sendVerifyResetPsw } from "@/firebase/auth/sendVerifyResetPsw";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/component/Loading";
import { setRepofirebaseGithub } from "@/dataManagement/firebaseGithub/setRepoFirebaseGithub";
import { setWorkSpaceIdfirebaseClockify } from "@/dataManagement/firebaseWithClockify/setWorkspaceFirebaseClockify";
import { Input } from "@/components/ui/input";
import { editProfile } from "@/firebase/auth/editProfile";
import { uploadImage } from "@/firebase/storage/uploadImage";
import { deleteImage } from "@/firebase/storage/deleteImage";
import NavBar from "@/components/component/NavBar";

export default function page() {
    const route = useRouter();
    const [repos, setRepos] = useState([]);
    const [repoSelected, setRepoSelected] = useState();
    const [workspacesGithub, setWorkspacesGithub] = useState([]);
    const imageRef = useRef();
    const newFullNameRef = useRef();
    const newEmailRef = useRef();
    const passwordRef = useRef();

    const [firebaseRepo, setFirebaseRepo] = useState();
    const [keySelectedGithub, setKeySelectedGithub] = useState(null);
    const [firebaseWorkspaceClockify, setFirebaseWorkspaceClockify] =
        useState();
    const [keySelectedClockify, setKeySelectedClockify] = useState(null);
    const [workspacesClockify, setWorkspacesClockify] = useState([]);
    const [workspaceNameSelectedClockify, setWorkspaceNameSelectedClockify] =
        useState();

    const [keySelected, setKeySelected] = useState(null);
    const [userData, setUserData] = useState({});
    const [isLogged, setIsLogged] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // console.log("key : ", keySelectedClockify);
        // console.log("workspace : ", workspaceNameSelectedClockify);

        if (keySelected !== null) {
            auth.onAuthStateChanged((user) => {
                // setFirebaseWorkspace(setRepofirebaseGithub(workspaceNameSelected, user?.uid))
                setFirebaseWorkspaceClockify("loading");
                setWorkSpaceIdfirebaseClockify(keySelectedClockify, user?.uid)
                    .then((res) => {
                        console.log(res);
                        setFirebaseWorkspaceClockify(res.status);
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setFirebaseWorkspaceClockify(res.status);
                    });
            });
        }
    }, [keySelectedClockify]);
    const getUserData = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogged(true);
                getDocument("userData", user?.uid).then((response) => {
                    setUserData({ ...user, ...response?.result?.data() });
                });
            } else {
                route.push("/login");
                console.log("logout from setting");
            }
        });
    };
    useEffect(() => {
        getUserData();
        const getRepos = async () => {
            const response = await getGitHubUserRepos();
            setRepos(response);
            // console.log("repos", response);
        };
        getRepos();
        const getyWorkSpacesClockify = async () => {
            const response = await getClockifyWorkSpaces();
            setWorkspacesClockify(response);
            // console.log("workspaces", response);
        };
        getyWorkSpacesClockify();
    }, []);

    useEffect(() => {
        if (repoSelected !== undefined) {
            auth.onAuthStateChanged((user) => {
                // setFirebaseRepo(setRepofirebaseGithub(repoSelected, user?.uid))
                setFirebaseRepo("loading");
                setRepofirebaseGithub(repoSelected, user?.uid)
                    .then((res) => {
                        console.log(res);
                        setFirebaseRepo(res.status);
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setFirebaseRepo(res.status);
                    });
            });
        }
    }, [repoSelected]);
    const handleChangeProfilePhoto = async () => {
        const image = imageRef.current?.files[0];
        await uploadImage(userData?.uid, image);
        getUserData();
    };
    const deleteProfilePhoto = async () => {
        await deleteImage(`ProfilePhoto/${userData?.uid}`);
        getUserData();
    };

    const handleChangeFullName = async () => {
        const newFullName = newFullNameRef.current.value;
        if (!newFullName) return;
        const res = await editProfile({ displayName: newFullName });
        console.log("full name", res);
    };
    const hanldeChangeEmail = async (e) => {
        e.preventDefault();
        const newEmail = newEmailRef.current.value;
        const password = passwordRef.current.value;

        if (newEmail && userData && password) {
            const res = await editEmail(userData?.email, newEmail, password);
            console.log(res);
        }
    };
    // send verifiction set password in email
    const handleSendVerification = async () => {
        if (userData) {
            const response = await sendVerifyResetPsw(userData?.email);
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
                                <Avatar className=" border-2 w-[90px] h-[90px]">
                                    <AvatarImage
                                        alt="User"
                                        className=""
                                        src={userData?.photoURL}
                                    />
                                    <AvatarFallback className="capitalize font-bold text-3xl">
                                        {userData?.displayName?.split("")[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex ml-3 gap-2">
                                    <Input
                                        type="file"
                                        ref={imageRef}
                                        className=" cursor-pointer  px-3 py-1 w-[160px] "
                                        onChange={handleChangeProfilePhoto}
                                    />

                                    {userData?.photoURL && (
                                        <button
                                            onClick={deleteProfilePhoto}
                                            className="border-2 px-3 py-1 rounded-lg"
                                        >
                                            remove
                                        </button>
                                    )}
                                </div>
                            </li>
                        </ul>

                        <form className="">
                            <div className="mt-8 ">
                                {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                                <div className="rounded-md flex flex-col items-end justify-end ">
                                    <div className=" w-[100%] mx-auto flex items-center justify-end sm:justify-between">
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
                                            className="rounded relative block w-[160px]  px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="New Full Name"
                                            ref={newFullNameRef}
                                            onBlur={handleChangeFullName}
                                        />
                                    </div>

                                    <div className="w-[100%] mx-auto  flex items-center justify-end sm:justify-between">
                                        <label
                                            htmlFor="email-address"
                                            className="w-[40%] relative hidden sm:block"
                                        >
                                            <span className="absolute left-[30%]">
                                                New Email address
                                            </span>
                                        </label>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className=" w-[160px]"
                                                >
                                                    Edit email
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Edit email
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your
                                                        email here. Click save
                                                        when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <label
                                                            htmlFor="newEmail"
                                                            className="text-right"
                                                        >
                                                            New email
                                                        </label>
                                                        <Input
                                                            id="newEmail"
                                                            defaultValue={`${userData?.email}`}
                                                            className="col-span-3"
                                                            ref={newEmailRef}
                                                            autoComplete="email"
                                                            type="email"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <label
                                                            htmlFor="username"
                                                            className="text-right"
                                                        >
                                                            Password
                                                        </label>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            className="col-span-3"
                                                            ref={passwordRef}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={
                                                            hanldeChangeEmail
                                                        }
                                                    >
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="w-[100%] mx-auto  flex items-center justify-end sm:justify-between">
                                        <label className="w-[40%] relative hidden sm:block">
                                            <span className="absolute left-[30%]">
                                                Set password
                                            </span>
                                        </label>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="mt-6 w-[160px]"
                                                >
                                                    Set password
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
                        <h3>
                            changing your workspace in clockify{" "}
                            <span>
                                {workspaceNameSelectedClockify
                                    ? workspaceNameSelectedClockify
                                    : userData?.githubRepo}
                            </span>
                        </h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className={`mt-1 min-w-[160px] px-3`}>
                                    Change workspace
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
                                    {firebaseWorkspaceClockify == "loading" ? (
                                        <Loading />
                                    ) : (
                                        <ScrollArea className="h-[200px] w-full rounded-md border">
                                            <div className="p-4">
                                                <h4 className="mb-4 text-sm font-medium leading-none">
                                                    workspace
                                                </h4>

                                                <hr />

                                                {workspacesClockify !==
                                                    undefined &&
                                                    workspacesClockify?.map(
                                                        (workspace) => (
                                                            <div
                                                                key={
                                                                    workspace?.name
                                                                }
                                                            >
                                                                <p
                                                                    onClick={() => {
                                                                        // console.log("workspace : ",workspace?.name);
                                                                        setWorkspaceNameSelectedClockify(
                                                                            workspace?.name
                                                                        );
                                                                        setKeySelectedClockify(
                                                                            workspace?.id
                                                                        );
                                                                    }}
                                                                    className={`text-sm cursor-pointer ${
                                                                        workspace?.name ==
                                                                            workspaceNameSelectedClockify &&
                                                                        "bg-[#b4b5b6]"
                                                                    } hover:bg-[#ddd]  p-2 my-1 rounded-lg`}
                                                                >
                                                                    {
                                                                        workspace?.name
                                                                    }
                                                                </p>
                                                                <hr />
                                                            </div>
                                                        )
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
                                                    workspaceNameSelectedClockify
                                                )
                                            }
                                        >
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="bg-white rounded-lg  p-4 my-4">
                        <h3>
                            changing your repositorie in github ,
                            <span>
                                {repoSelected
                                    ? repoSelected
                                    : userData?.githubRepo}
                            </span>
                        </h3>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-6 min-w-[160px] px-3">
                                    Change repository
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
                                    {firebaseRepo == "loading" ? (
                                        <Loading />
                                    ) : (
                                        <ScrollArea className="h-[200px] w-full rounded-md border">
                                            <div className="p-4">
                                                <h4 className="mb-4 text-sm font-medium leading-none">
                                                    repos
                                                </h4>
                                                <hr />

                                                {repos?.map((repo, index) => (
                                                    <div key={index}>
                                                        <p
                                                            onClick={() => {
                                                                console.log(
                                                                    repo
                                                                );
                                                                setRepoSelected(
                                                                    repo.name
                                                                );
                                                                setKeySelectedGithub(
                                                                    index
                                                                );
                                                                // setRepofirebaseGithub(repo.name)
                                                            }}
                                                            className={`text-sm cursor-pointer ${
                                                                index ==
                                                                    keySelectedGithub &&
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
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                console.log(
                                                    "repoSelected : ",
                                                    repoSelected
                                                )
                                            }
                                        >
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
            </>
        );
    }
}
