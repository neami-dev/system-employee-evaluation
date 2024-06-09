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
import { Input } from "@/components/ui/input";
import { editProfile } from "@/firebase/auth/editProfile";
import { uploadImage } from "@/firebase/storage/uploadImage";
import { deleteImage } from "@/firebase/storage/deleteImage";

import { updateEmployee } from "@/firebase/firebase-admin/updateEmployee";

export default function page() {
    const route = useRouter();
    const [open, setOpen] = useState(false);
    const imageRef = useRef();
    const newFullNameRef = useRef();
    const newEmailRef = useRef();
    const passwordRef = useRef();

    const [userData, setUserData] = useState({});

    const { toast } = useToast();
    const getUserData = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDocument("userData", user?.uid).then((response) => {
                    response.result &&
                        setUserData({ ...response.result.data(), ...user });
                });
            }
        });
    };
    useEffect(() => {
        getUserData();
    }, [userData]);
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
        const password = passwordRef.current?.value;

        if (!newEmail || !password) {
            toast({
                variant: "destructive",
                description: "Email and password are required!",
            });
            return false;
        }
        const responseEdit = await editEmail(
            userData?.email,
            newEmail,
            password
        );

        if (responseEdit?.error !== null) {
            toast({
                variant: "destructive",
                description: "Email not changed",
            });
            return false;
        }
        const responseUpdate = await updateEmployee({
            uid: auth.currentUser?.uid,
            emailVerified: true,
        });
        if (responseUpdate?.error === null) {
            toast({
                description: "Email changed",
            });
            return true;
        }

        // const response = await sendEmailVerify();
        // if (response?.error !== null) {
        //     toast({
        //         variant: "destructive",
        //         description: "Email not changed," + responseEdit?.error.message,
        //     });
        // }
        // toast({
        //     description: "Email changed ,wait verfiction email",
        // });
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

                                    <Dialog open={open} onOpenChange={setOpen}>
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
                                                    Make changes to your email
                                                    here. Click save when you're
                                                    done.
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
                                                        required
                                                        ref={passwordRef}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    onClick={(e) => {
                                                        hanldeChangeEmail(
                                                            e
                                                        ).then(
                                                            (res) =>
                                                                res === true &&
                                                                setOpen(false)
                                                        );
                                                    }}
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
                                                    By clicking "Set Password",
                                                    an email will be sent to{" "}
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

                <div className="bg-white rounded-lg  p-4 my-4">
                    <h3>changing your workspace in clickUp</h3>

                    <Button
                        onClick={() =>
                            route.push(
                                `https://app.clickup.com/api?client_id=${process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID}&redirect_uri=http://localhost:3000/api_services/clickupAuth`
                            )
                        }
                        className="mt-6 w-[160px] gap-x-3 "
                    >
                        change workspace
                    </Button>
                </div>
                <div className="bg-white rounded-lg  p-4 my-4 ">
                    <h3>changing your workspace in clockify </h3>

                    <Button
                        onClick={() => {
                            route.push("/services/clockify");
                        }}
                        className={`mt-6 w-[160px] gap-x-3 `}
                    >
                        Change workspace
                    </Button>
                    <div className="grid gap-4 py-4"></div>
                </div>
                <div className="bg-white rounded-lg  p-4 my-4">
                    <h3>changing your repositorie in github ,</h3>
                    <Button
                        onClick={() => {
                            route.push(
                                `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user,repo`
                            );
                        }}
                        className={`mt-1 min-w-[160px] px-3`}
                    >
                        Change repositorie
                    </Button>
                </div>
            </section>
        </>
    );
}
