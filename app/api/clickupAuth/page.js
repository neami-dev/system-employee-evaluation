"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClickupTokenHandler from "./ClickupTokenHandler";
import Loading from "@/components/component/Loading";
import { auth } from "@/firebase/firebase-config";

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
                router.push("/login");
            }
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
        return () => unsubscribe(); // Cleanup subscription
    }, [router]); // router added to the dependency array

    async function exchangeCodeForToken(code, uid) {
        console.log("UID:", uid);
        const dataToken = await ClickupTokenHandler(code, uid);

        if (dataToken === true) {
            console.log("Access token obtained successfully.");
            router.push("/auth-process");
        } else {
            console.error("Failed to obtain access token:", dataToken);
            router.push("/login");
        }
    }

    return <Loading />;
}