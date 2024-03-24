"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ClickupTokenHandler from "./ClickupTokenHandler";
import Loading from "@/components/component/Loading";

export default function ClickupCallback() {
    const route = useRouter();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        if (code) {
            console.log("Authorization Code:", code);
            exchangeCodeForToken(code);
        }
    }, []);

    async function exchangeCodeForToken(code) {
        const dataToken = await ClickupTokenHandler(code);

        if (dataToken) {
            console.log("accessToken good ");
            route.push("/employee/dashboard");
        } else {
            console.error(dataToken);
            route.push("/login");
        }
    }

    return (
        <>
            <Loading />
        </>
    );
}
