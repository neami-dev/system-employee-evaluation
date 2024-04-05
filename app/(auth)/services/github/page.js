"use client";
import { CheckCircle2 } from "lucide-react";
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
import { getGitHubUserRepos } from "@/app/api_services/actions/githubActions";
import { setRepofirebaseGithub } from "@/dataManagement/firebaseGithub/setRepoFirebaseGithub";
import Loading from "@/components/component/Loading";

function GithubPage() {
    const router = useRouter();

    const [repos, setRepos] = useState([]);
    const [repoSelected, setRepoSelected] = useState();
    const [firebaseRepo, setFirebaseRepo] = useState();
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
        const getRepos = async () => {
            const response = await getGitHubUserRepos();
            setRepos(response);
            // console.log("repos", response);
        };
        getRepos();
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

    console.log(userData);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Github
            </h1>
            <ul className="text-lg text-gray-800 list-none space-y-2 mb-8">
                <li className="flex items-center mb-9">
                    <CheckCircle2 className="h-9 w-9 text-green-500 mr-2" />{" "}
                    {/* "DONE" icon */}
                    <span className="text-green-600 text-[25px] font-semibold">
                        Token is integrated
                    </span>
                </li>
                <li className="flex items-center my-5">
                    <CheckCircle2
                        className={`${
                            firebaseRepo == "OK"
                                ? "text-green-500"
                                : "text-gray-500"
                        } min-h-9 min-w-9  mr-2`}
                    />{" "}
                    {/* "DONE" icon */}
                    <span
                        className={`${
                            firebaseRepo == "OK"
                                ? "text-green-600"
                                : "text-gray-600"
                        }  text-[25px] font-semibold`}
                    >
                        Choose the repo you are working on :
                    </span>
                </li>
                <li className="mt-3 ml-[40px]">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-6 min-w-[160px] px-3">
                                {/* Choose repositorie */}
                                {repoSelected
                                    ? repoSelected
                                    : "Choose repositorie"}
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

                                            {repos.map((repo, index) => (
                                                <div key={index} className="">
                                                    <p
                                                        onClick={() => {
                                                            console.log(repo);
                                                            setRepoSelected(
                                                                repo.name
                                                            );
                                                            setKeySelected(
                                                                index
                                                            );
                                                            // setRepofirebaseGithub(repo.name)
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
                                )}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" onClick={() => console.log("repoSelected : ",repoSelected)}>
                                    Close
                                  </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </li>
                <li className="flex items-center justify-end mb-3">
                    <Button
                        className={`${
                            firebaseRepo == "OK"
                                ? "bg-black hover:bg-black"
                                : "bg-gray-400 hover:bg-gray-400"
                        } text-[20px]  font-semibold mt-9`}
                        type="button"
                        onClick={() =>
                            firebaseRepo == "OK"
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

export default GithubPage;
