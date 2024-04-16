"use server";

import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { addCookie, addCookieServer} from "../actions/handleCookies";

export default async function GithubTokenHandler(code, uid) {
    try {
        if (!code || !uid) {
            console.log("field code or uid");
            return;
        }
        const tokenResponse = await fetch(
            `${process.env.GITHUB_BASE_URL}/oauth/access_token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            }
        );

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            console.log("token exchange failed");
            return;
        }

        await updateDocumentA({
            collectionName: "userData",
            id: uid,
            data: { githubToken: tokenData.access_token },
        });
        addCookieServer("githubToken", tokenData.access_token);

        console.log(" setting the token in firebase");
        return true;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}
