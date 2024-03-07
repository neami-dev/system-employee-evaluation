"use client";
 
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signIn";

export default function login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const route = useRouter();

    const login = async () => {

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const result = await signIn({ email, password });
        console.log(result.error);

        if (result.error == null) {
            route.push("/employee/profile");
        }
    };
    return (
        <>
            <div>
                <h3> Login </h3>
                <input placeholder="Email..." ref={emailRef} />
                <input placeholder="Password..." ref={passwordRef} />

                <button onClick={login}> Login</button>
            </div>
        </>
    );
}
