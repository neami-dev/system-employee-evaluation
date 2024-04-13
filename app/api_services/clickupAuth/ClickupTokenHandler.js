"use server";

import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { addCookie } from "../actions/handleCookies";

export async function ClickupTokenHandler(code, uid) {
    try {
        if (!code || !uid) return;

        const tokenResponse = await fetch(
            `${process.env.CLICKUP_BASE_URL}/oauth/token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID,
                    client_secret: process.env.CLICKUP_CLIENT_SECRET,
                    code,
                }),
            }
        );
        const tokenData = await tokenResponse.json();
        console.log(tokenData);
        if (!tokenData.access_token) {
            console.log("token exchange failed");
            return;
        }
        await updateDocumentA({
            collectionName: "userData",
            id: uid,
            data: { clickupToken: tokenData.access_token },
        });
        addCookie("clickupToken", tokenData.access_token);
        console.log(" setting the token in firebase");
        return true;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}
