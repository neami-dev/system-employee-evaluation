"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import signUp from "@/firebase/auth/signUp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Loading from "@/components/component/Loading";

export default function regsiter() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const fullNameRef = useRef();
    const router = useRouter();
    const [errors, setErrors] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        errors.forEach((error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error, // Now passing a single error message
                action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                ),
            });
        });
    }, [errors, toast]);

    const handleForm = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const fullName = fullNameRef.current.value.trim();

        setErrors([]); // Clear previous errors

        let newErrors = [];
        if (!password) newErrors.push("Password required!");
        if (!email) newErrors.push("Email required!");
        if (!fullName) newErrors.push("Full name required!");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setIsLoading(false); // Stop loading if there are validation errors
            return; // Stop the function if there are errors
        }

        const result = await signUp({ email, password, fullName });

        if (result.error) {
            setErrors([
                ...errors,
                `Error: ${result.error?.code?.split("/")[1]}`,
            ]);
            setIsLoading(false); // Stop loading after handling the sign-up attempt
        } else {
            console.log("Sign-up successful, redirecting...");
            // router.push("/employee/profile");
            router.push("http://localhost:3000/services");
        }
    };
    return (
        <>
            
            {isLoading ?<Loading />:<main className="flex relative">
                <div className="w-[600px] h-[100vh] relative max-lg:hidden">
                    {" "}
                    {/* desktop size */}
                    <img
                        src="/images/wenearBanner.jpg"
                        alt=""
                        className="w-[100%] h-[100%] "
                    />
                    <img
                        src="/images/wenearLogo.png"
                        alt=""
                        className="w-[250px] h-[150px] -rotate-[20deg] absolute top-[35%] left-[20%] "
                    />
                </div>

                <div className="flex items-center lg:hidden absolute top-[20px] left-[20px]">
                    {" "}
                    {/* other sizes */}
                    <img
                        src="/images/wenearLogo.png"
                        alt=""
                        className="w-[35px] h-[27px] "
                    />
                    <p className="font-bold text-[25px] text-gray-700 ">
                        ENEAR
                    </p>
                </div>

                <div className="lg:relative rounded-lg w-full h-[100vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-[90%] lg:w-[40%] max-lg:w-[35%] max-md:w-[45%] max-sm:w-[65%] space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Join us
                            </h2>
                        </div>
                        <form onSubmit={handleForm} method="Post">
                            <div className="mt-8 space-y-6">
                                {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <label
                                            htmlFor="full-name"
                                            className="sr-only"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            id="full-name"
                                            name="fullName"
                                            type="username"
                                            required
                                            className="rounded relative block w-full px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Full Name"
                                            ref={fullNameRef}
                                            // value={email}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email-address"
                                            className="sr-only"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className=" rounded relative block w-full px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Email address"
                                            ref={emailRef}
                                            // value={email}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Password"
                                            ref={passwordRef}
                                            // value={password}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex justify-center">
                                    <Button
                                        // onClick={handleForm}
                                        type="submit"
                                        className="group w-[120px] relative flex justify-center py-2 px-4 border border-transparent 
                                text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {" "}
                                        Enter
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <a
                                            href="/login"
                                            className="font-medium text-teal-600 hover:text-teal-500"
                                        >
                                            Already have account?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex gap-5 absolute bottom-[15px] left-[20px] ">
                        <p className="text-[15px] text-gray-500 cursor-pointer">
                            Privacy Policy
                        </p>
                        <p className="text-[15px] text-gray-500 cursor-pointer">
                            Terms & conditions
                        </p>
                    </div>
                </div>
            </main>
            }
        </>
    );
}
