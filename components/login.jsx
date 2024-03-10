"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signIn";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const route = useRouter();
    const [errors, setErorrs] = useState([]);

    const { toast } = useToast();

    useEffect(() => {
        if (errors[0] !== undefined ) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: errors,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }

    }, [errors])

    const login = async () => {
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        setErorrs("");
        if (!email) {
            setErorrs("");
            return setErorrs((prev) => [...prev, "email required !"]);
        }
        if (!password) {
            setErorrs("");
            return setErorrs((prev) => [...prev, "password required !"]);
        }
        const result = await signIn({ email, password });

        setErorrs((prev) => [
            ...prev,
            JSON.stringify(result.error?.code?.split("/")[1]),
        ]);

        if (result.error == null) {
            route.push("/employee/profile");
        }
    };
    return (
        <>
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
                        {/* <form className="" onSubmit={login}> */}
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
                                    onClick={login}
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
                        {/* </form> */}
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
// import Link from "next/link";
// import React from "react";

// export default async function hello() {
//     const res = await fetch("https://fakestoreapi.com/products/1",{
//         cache:"no-cache"
//     });
//     const data = await res.json();
//     console.log(data);
//     return (
//         <>
//             <div>hello</div>
//             <Link href="employee/profile">{data.title}</Link>
//         </>
//     );
// }
