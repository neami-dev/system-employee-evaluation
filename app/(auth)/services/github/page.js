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
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";
import { getGitHubUserRepos } from "@/app/api_services/actions/githubActions";
import Loading from "@/components/component/Loading";
import {
    addCookie,
    getAllCookies,
} from "@/app/api_services/actions/handleCookies";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { useToast } from "@/components/ui/use-toast";

function GithubPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [repos, setRepos] = useState([]);
    const [repoSelected, setRepoSelected] = useState(null);
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
            console.log("repos", response);
        };
        getRepos();
    }, []);

    useEffect(() => {
        const addRepoSelected = async () => {
            if (repoSelected !== null) {
                const response = await updateDocumentA({
                    collectionName: "userData",
                    id: userData?.uid,
                    data: { githubRepo: repoSelected },
                });
                if (response?.error) {
                    console.log(response?.error);
                    return;
                }
                toast({
                    description: "you choosed " + repoSelected,
                });
                addCookie("githubRepo", repoSelected);
            }
        };
        addRepoSelected();
    }, [repoSelected]);

    // console.log(userData);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Github
            </h1>
            <ul className="text-lg text-gray-800 list-none space-y-2 mb-8">
                <li className="flex items-center mb-9">
                    <CheckCircle2 className="h-5 w-5 sm:h-9 sm:w-9 text-green-500 mr-2" />{" "}
                    <span className="text-green-600 text-[15px] sm:text-[25px] font-semibold">
                        Token is integrated
                    </span>
                </li>
                <li className="flex items-center my-5">
                    <CheckCircle2
                        className={`${
                            repoSelected ? "text-green-600" : "text-gray-600"
                        } h-5 w-5 sm:h-9 sm:w-9 mr-2`}
                    />

                    <span
                        className={`${
                            repoSelected ? "text-green-600" : "text-gray-600"
                        }  text-[15px] sm:text-[25px] font-semibold`}
                    >
                        Choose the repo you are working on :
                    </span>
                </li>
                <li className="mt-3 ml-[30px]">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-4 sm:mt-6 sm:px-3">
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
                                <ScrollArea className="h-[200px] w-full rounded-md border">
                                    <div className="p-4">
                                        <h4 className="mb-4 text-sm font-medium leading-none">
                                            repos
                                        </h4>
                                        <hr />

                                        {repos?.length > 0 ? (
                                            repos?.map((repo) => (
                                                <div
                                                    key={repo.name}
                                                    className=""
                                                >
                                                    <p
                                                        onClick={() => {
                                                            setRepoSelected(
                                                                repo.name
                                                            );
                                                        }}
                                                        className={`text-sm cursor-pointer ${
                                                            repo.name ==
                                                                repoSelected &&
                                                            "bg-[#b4b5b6]"
                                                        } hover:bg-[#ddd]  p-2 my-1 rounded-lg`}
                                                    >
                                                        {repo?.name}
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
                </li>
                <li className="flex items-center justify-end mb-3">
                    <Button
                        disabled={!repoSelected}
                        className={`${"bg-black hover:bg-black"} text-[20px]  font-semibold mt-9`}
                        type="button"
                        onClick={() => router.push("/services")}
                    >
                        submit
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default GithubPage;
