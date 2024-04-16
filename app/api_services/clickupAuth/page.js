"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClickupTokenHandler } from "./ClickupTokenHandler";
import Loading from "@/components/component/Loading";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";

export default function ClickupCallback() {
    const router = useRouter(); // Corrected variable name based on import

    const [userData, setUserData] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const queryParams = new URLSearchParams(window.location.search);
                const code = queryParams.get("code");
                if (code) {
                    console.log("Authorization Code:", code);
                    exchangeCodeForToken(code, user?.uid); // Pass UID directly
                }
            }
        });
    }, []); // router added to the dependency array

    async function exchangeCodeForToken(code, uid) {
        console.log("UID:", uid);
        console.log("code", code);
        const dataToken = await ClickupTokenHandler(code, uid);
        console.log("1", dataToken?.result);
        if (dataToken?.result) {
            console.log("Access token obtained successfully.");
            
            if (auth?.currentUser?.emailVerified) {
                router.push("/employee/dashboard");
            } else {
                router.push("/services");
            }
            return;
        } else {
        
            console.log("Failed to obtain access token:");
            // router.push("/login");
        }
    }

    return (
        <>
            <Loading />
        </>
    );
}
