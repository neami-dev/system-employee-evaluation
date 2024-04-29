"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import ClickupTokenHandler from "./ClickupTokenHandler";

import { auth } from "@/firebase/firebase-config";
import GithubTokenHandler from "./GithubTokenHandler";

export default function ClickupCallback() {
    const router = useRouter(); // Corrected variable name based on import
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const handleAuthStateChange = (user) => {
            if (user?.uid) {
                setUid(user.uid);
                console.log(user.uid);

                const queryParams = new URLSearchParams(window.location.search);
                const code = queryParams.get("code");
                if (code) {
                    console.log("Authorization Code:", code);
                    exchangeCodeForToken(code, user.uid); // Pass UID directly
                }
            } else {
                // Handle scenario when there is no authenticated user
                router.push("/services");
            }
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
        return () => unsubscribe(); // Cleanup subscription
    }, [router]); // router added to the dependency array

    async function exchangeCodeForToken(code, uid) {
        console.log("UID:", uid);
        console.log("code : ",code);
        const dataToken = await GithubTokenHandler(code,uid);

        if (dataToken === true) {
            console.log("Access token obtained successfully.");
            router.push("/services/github");
        } else {
            console.error("Failed to obtain access token:", dataToken);
            // router.back();
        }
    }
}