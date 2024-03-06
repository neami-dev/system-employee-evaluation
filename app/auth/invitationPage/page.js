"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useRef } from "react";
import { auth, db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";

export default function regsiter() {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const register = async () => {
        console.log(
            emailRef.current.value,
            passwordRef.current.value,
            fullNameRef.current.value
        );

        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );
            await updateProfile(response.user, {
                displayName: fullNameRef.current.value,
                photoURL: "https://example.com/jane-q-user/profile.jpg",
            });
            const userRef = doc(db, "userData", response.user.uid);
            const data = {
                department: null,
                joiningDate: new Date(),
                score: 0,
            };
            await setDoc(userRef, data);
            console.log("Document added successfully!");
            console.log(response.user);
            
        } catch (error) {
            console.log("error in creation", error.message);
        }
    };

    return (
        <>
            <div>
                <h3> Register User </h3>
                <input placeholder="fullName..." ref={fullNameRef} />
                <input placeholder="Email..." ref={emailRef} />
                <input placeholder="Password..." ref={passwordRef} />

                <button onClick={register}> Create User</button>
            </div>
        </>
    );
}
