"use server";

import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { addCookie, addCookieServer } from "../actions/handleCookies";
import axios from "axios";

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
        // get username to added in firebase
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${tokenData.access_token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const username = response?.data?.login;
        await updateDocumentA({
            collectionName: "userData",
            id: uid,
            data: { githubToken: tokenData?.access_token, username },
        });
        addCookieServer("githubToken", tokenData.access_token);

        console.log(" setting the token in firebase");
        return true;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}
