"use server";

import updateDocumentA from "@/firebase/firestore/updateDocumentA";
import { addCookie, addCookieServer } from "../actions/handleCookies";
import axios from "axios";

export async function ClickupTokenHandler(code, uid) {
    let result,
        error = false;
    const API_BASE_URL = process.env.CLICKUP_BASE_URL;

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
        const responseTeam = await axios.get(`${API_BASE_URL}/team`, {
            headers: {
                Authorization: tokenData?.access_token,
                "Content-Type": "application/json",
            },
        });
        const responseUser = await axios.get(`${API_BASE_URL}/user`, {
            headers: {
                Authorization: tokenData?.access_token,
                "Content-Type": "application/json",
            },
        });
        console.log(responseTeam);
        addCookieServer("clickupToken", tokenData?.access_token);
        await updateDocumentA({
            collectionName: "userData",
            id: uid,
            data: {
                clickupToken: tokenData?.access_token,
                clickupTeam: responseTeam?.data?.teams[0]?.id,
                clickupUser: responseUser?.data?.user?.id,
            },
        });
        result = true;

        console.log(" setting the token in firebase");
    } catch (error) {
        console.log(error.message);
        error = error.message;
    }
    return { result, error };
}
