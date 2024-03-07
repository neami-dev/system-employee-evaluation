"use client";
 
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signIn";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const route = useRouter();

    const login = async () => {

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        console.log('email : ',email);
        console.log('password : ',password);

        const result = await signIn({ email, password });
        console.log("result: ", result.result);
        console.log("error: ", result.error);
        if (result.error == null) {
            route.push("/employee/profile");
        }
        
    };
    return (
        <>
        <main className="flex">
            <div className="w-[35%] h-[100vh] ">
                <img src="/images/wenearBanner.png" alt="" className="w-[100%] h-[100%] " />
            </div>
            
            <div className="w-[100%] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className=" w-[40%]  space-y-8">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
            </div>
            {/* <form className="" onSubmit={login}> */}
            <div className="mt-8 space-y-6">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <Input 
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
                    <label htmlFor="password" className="sr-only">Password</label>
                    <Input 
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

                <div className="flex items-center justify-between">
                    {/* <div className="flex items-center">
                    <Input 
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                    </label>
                    </div> */}

                    <div className="text-sm">
                    <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                        Forgot your password?
                    </a>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <Button onClick={login} type="submit"
                    className="group w-[120px] relative flex justify-center py-2 px-4 border border-transparent 
                        text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    > ENTER
                    </Button>
                </div>
            </div>
            {/* </form> */}
        </div>
        </div>
        </main>
        </>
    );
}
