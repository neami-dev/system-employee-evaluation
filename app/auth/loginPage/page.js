"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signIn";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Loading from "@/components/loading";
import { auth } from "@/firebase/firebase-config";

export default function login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const route = useRouter();
    const [errors, setErrors] = useState([]);
    
    const { toast } = useToast()
    
    const [isLoading, setIsLoading] = useState(false); // Add a loading state
    
    useEffect(() => { // lanch the alert toast if there is an error
        if (errors[0] !== undefined) {
            console.log("error : ",errors[0]);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: errors,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })      
        }
       
    }, [errors])
    


    const login = async (e) => {
        e.preventDefault();

        setIsLoading(true); // Start loading
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        
        setErrors([]); // Clear errors at the start
        if (!email || !password) {
            const errors = [];
            if (!email) errors.push("  Email is required!");
            if (!password) errors.push("  Password is required!");
            setErrors(errors);
            setIsLoading(false); // Stop loading if validation fails
            return;
        }
        
        const result = await signIn({ email, password });
        if (result.error) {
            setErrors([result.error?.code?.split("/")[1]]);
            setIsLoading(false); // Stop loading after auth attempt
        } else {
            console.log("Authentication successful: ", auth);
            route.push("/employee/profile");
        }
    };

    return (
        <>
            {isLoading && <Loading />}
            <main className="flex relative">
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
                                Login
                            </h2>
                        </div>
                        <form className="" onSubmit={login} >
                        <div className="mt-8 space-y-6">
                            {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                            <div className="rounded-md shadow-sm -space-y-px">
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
                                        className="rounded relative block w-full px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                    // onClick={login}
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
                                        href="#"
                                        className="font-medium text-teal-600 hover:text-teal-500"
                                    >
                                        Forgot your password?
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
        </>
    );
}
