"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import signUp from "@/firebase/auth/signUp";
 
export default function regsiter() {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const route = useRouter();

    const handleForm = async () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const fullName = fullNameRef.current.value;
       

        const response = await signUp({email,password,fullName})
        console.log(response.result);
        console.log(response.error);
        if (response.error == null) {
            route.push("/employee/profile");
        }
       
    };

    return (
        <>
            <div>
                <h3> Register User </h3>
                <input placeholder="fullName..." ref={fullNameRef} />
                <input placeholder="Email..." ref={emailRef} />
                <input placeholder="Password..." ref={passwordRef} />

                <button onClick={handleForm}> Create User</button>
            </div>
        </>
    );
}
