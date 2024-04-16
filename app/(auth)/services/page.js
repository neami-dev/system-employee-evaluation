"use client";
import { CheckTokens } from "@/app/api_services/actions/handleCookies";
import Loading from "@/components/component/Loading";

import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowBigRightDash, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const IntegrationPage = () => {
    const route = useRouter();
    const [Clickup, setClickup] = useState(null);
    const [Github, setGithub] = useState(null);
    const [Clockify, setClockify] = useState(null);
    const [isEmailValid, setIsEmailValid] = useState(false);

    // Conditional for button visibility
    const isAllIntegrated = Clickup && Github && Clockify;

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) route.push("/login");
            // console.log(user);
            setIsEmailValid(user?.emailVerified);

            const response = await getDocument("userData", user?.uid);
            if (response.error) return;

            if (response.result?.data()?.clickupToken) {
                setClickup(true);
            } else {
                setClickup(false);
            }
            if (
                response.result?.data()?.clockifyUserId &&
                response.result?.data()?.ClockifyWorkspace &&
                response.result?.data()?.clockifyApiKey
            ) {
                setClockify(true);
            } else {
                setClockify(false);
            }
            if (
                response.result?.data()?.githubRepo &&
                response.result?.data()?.githubToken
            ) {
                setGithub(true);
            } else {
                setGithub(false);
            }

            console.log({ ...user, ...response.result?.data() });
        });
    }, []);
    const jsxAccordingCondictions = () => {
        console.log("isEmailValid", isEmailValid);
        if (isAllIntegrated && isEmailValid) {
            return (
                <button
                    onClick={() => route.push("/employee/dashboard")}
                    className="flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg mt-20 w-48 py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out"
                >
                    Dashboard
                    <ArrowBigRightDash className="w-6 h-6" />
                </button>
            );
        } else if (isAllIntegrated && !isEmailValid) {
            return (
                <p className="mt-8 flex gap-1 flex-row items-center justify-center">
                    <CheckCircle2 className="text-green-500 min-h-9 min-w-9  mr-2" />
                    <span className="text-[#424242]">
                        Your information has been registered successfully. Wait
                        for administrator approval.
                    </span>
                </p>
            );
        }
    };

    return (
        <>
            {Clickup == null && Github == null ? (
                <Loading />
            ) : (
                <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 lg:p-10">
                    <h1 className="text-2xl lg:text-4xl font-bold text-blue-900 mb-4 lg:mb-6">
                        Service Integration Setup
                    </h1>
                    <p className="text-md lg:text-lg text-blue-800 mb-8 lg:mb-10 text-center">
                        Easily integrate your workflow across ClickUp, GitHub,
                        and Clockify with just a few clicks. Follow the steps
                        below to connect your accounts.
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-0 lg:flex-row lg:space-x-8">
                        {/* Integration Buttons */}
                        <button
                            onClick={() =>
                                route.push(
                                    `https://app.clickup.com/api?client_id=${process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID}&redirect_uri=http://localhost:3000/api_services/clickupAuth`
                                )
                            }
                            className={`${
                                Clickup
                                    ? "bg-green-500 hover:bg-green-700"
                                    : "bg-blue-500 hover:bg-blue-700"
                            } text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center space-x-2`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                            <span>ClickUp</span>
                        </button>
                        {/* Responsive Arrow */}
                        <div className="flex ">
                            <svg
                                className="w-6 h-6 text-blue-900 max-lg:transform max-lg:rotate-90"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                        <button
                            onClick={() =>
                                route.push(
                                    `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user,repo`
                                )
                            }
                            className={`${
                                Github
                                    ? "bg-green-500 hover:bg-green-700"
                                    : "bg-blue-500 hover:bg-blue-700"
                            } text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center space-x-2`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.087 2.912.832.092-.647.35-1.087.636-1.337-2.22-.253-4.555-1.111-4.555-4.941 0-1.091.39-1.983 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.802c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.699 1.028 1.591 1.028 2.682 0 3.841-2.339 4.685-4.566 4.931.359.309.678.921.678 1.859 0 1.341-.012 2.421-.012 2.749 0 .269.18.579.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                                ></path>
                            </svg>
                            <span>GitHub</span>
                        </button>
                        {/* Responsive Arrow */}
                        <div className="flex ">
                            <svg
                                className="w-6 h-6 text-blue-900 max-lg:transform max-lg:rotate-90"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                        <button
                            onClick={() => route.push(`/services/clockify`)}
                            className={`${
                                Clockify
                                    ? "bg-green-500 hover:bg-green-700"
                                    : "bg-blue-500 hover:bg-blue-700"
                            } text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center space-x-2`}
                        >
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 6v6l4 2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>Clockify</span>
                        </button>
                    </div>
                    {jsxAccordingCondictions()}
                </div>
            )}
        </>
    );
};

export default IntegrationPage;
