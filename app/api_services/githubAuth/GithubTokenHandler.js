"use server";

import { SetTokenfirebaseGithub } from "@/dataManagement/firebaseGithub/SetTokenFirebseGithub";
import { cookies } from "next/headers";

export default async function GithubTokenHandler(code, uid) {
    console.log("uid : ", uid);
    console.log("code : ", code);
    try {
        const tokenResponse = await fetch(
            `${process.env.GITHUB_BASE_URL}/oauth/access_token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json", // Requesting the response in JSON format
                },
                body: JSON.stringify({
                    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            }
        );
        console.log("fetched");
        const tokenData = await tokenResponse.json();
        if (tokenData.access_token) {
            console.log("the token is here : ", tokenData.access_token);
            // cookies().set("tokenGithub", tokenData.access_token);

            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
            cookies().set("tokenGithub", tokenData.access_token, {
            httpOnly: true, // Makes the cookie inaccessible to the client-side JS
            expires: oneMonthFromNow, // Set the cookie to expire after a month
            })

            const setToken = await SetTokenfirebaseGithub(
                uid,
                tokenData.access_token
            );
            console.log("setTOken : ", setToken);
            if (setToken == "OK") {
                return true;
            } else if (setToken == "FAILED") {
                console.log("failed setting the token in firebase");
                return "failed setting the token in firebase";
            }
        } else {
            console.log("token exchange failed");
            return "Token exchange failed";
        }
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}
