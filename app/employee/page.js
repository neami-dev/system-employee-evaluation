"use client";
import { signOut } from "firebase/auth";
import React, { use, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getDocument from "@/firebase/firestore/getData";
import { Result } from "postcss";

export default function page() {
    const [userData, setUserData] = useState({});
    const [data, setData] = useState({});
    const route = useRouter();
    const collectionName = "userData";
    const id = data?.uid;

    const logout = async () => {
        await signOut(auth);
    };

    const getData = async () => {
        if (id !== undefined && collectionName !== undefined) {
            const result = await getDocument({ collectionName, id });
            setUserData(result.result.data());
        }
    };
    auth.onAuthStateChanged((res) => {
        setData(res);

        if (data == null) {
            route.push("/auth/loginPage");
        }
    });
    useEffect(() => {
        getData();
    }, [collectionName, id]);

    console.log(userData);
    return (
        <>
            <div>page</div>
            <Link className=" bg-lime-700" href="auth/loginPage">
                login
            </Link>
            <button className=" bg-red-700" onClick={logout}>
                logout
            </button>
            <h4>{data?.email}</h4>
            <ul>
                <li>department {userData?.department}</li>
                <li>score {userData?.score}</li>
                <li>joiningDate {userData.joiningDate?.nanoseconds}</li>
            </ul>
        </>
    );
}
