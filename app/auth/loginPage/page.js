"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import React, { useRef } from "react";

export default function login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const login = async () => {
        console.log(emailRef.current.value, passwordRef.current.value);

        try {
            const response = await signInWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );
            console.log("response", response);
        } catch (error) {
            console.log("error in sign in ", error.message);
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
