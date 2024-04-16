"use server";

import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { addCookie, addCookieServer } from "../actions/handleCookies";

export async function ClickupTokenHandler(code, uid) {
    let result,
        error = false;

    try {
        
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
        
        if (!tokenData?.access_token) {
            console.log("token exchange failed");
            return false;
        }
        result = true;
        addCookieServer("clickupToken", tokenData?.access_token);
        await updateDocumentA({
            collectionName: "userData",
            id: uid,
            data: { clickupToken: tokenData?.access_token },
        });
      

        console.log(" setting the token in firebase");
    } catch (error) {
        console.log(error.message);
        error = error.message;
    }
    return { result, error };
}
