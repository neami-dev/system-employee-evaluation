"use client";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthenticatedUserDetails } from "./clickupActions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getGitHubUsername } from "./githubActions";
import { getClockifyUserData } from "./clockifyActions";
import { checkCookies } from "./handleCookies";

export const checkDataExistsInFirebase = async () => {
    let link,
        errorMsg = null;

    try {
        const user = auth?.currentUser;
        if (!user) return;
        checkCookies(user?.uid)
        const res = await getDocument("userData", user?.uid);
        const githibAuth = await getGitHubUsername();
        if (
            !res.result?.data()?.githubToken ||
            !res.result?.data()?.githubRepo ||
            githibAuth == null
        ) {
            // console.log("not authenticated for github",githibAuth);
            link = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user,repo`;

            errorMsg = "lack of information in github";
            console.log("lack of information in github");
            return { link, errorMsg };
        }
        const clickUpAuth = await getAuthenticatedUserDetails();

        if (!res.result?.data()?.clickupToken || clickUpAuth == null) {
            // console.log("not authenticated for github",clickUpAuth);

            link = `https://app.clickup.com/api?client_id=${process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID}&redirect_uri=http://localhost:3000/api_services/clickupAuth`;
            errorMsg = "lack of information in clickup";
            console.log("lack of information in clickup");
            return { link, errorMsg };
        }
        const clockifyAuth = await getClockifyUserData();
        console.log("clockifyAuth==", clockifyAuth);
        if (
            !res.result?.data()?.clockifyWorkspace ||
            !res.result?.data()?.clockifyApiKey ||
            !res.result?.data()?.clockifyUserId ||
            clockifyAuth == null
        ) {
            // console.log("not authenticated for clockifyAuth",clockifyAuth);

            link = "/services/clockify";
            errorMsg = "lack of information in clockify";
            console.log("lack of information in clockify");
            return { link, errorMsg };
        }
    } catch (error) {
        console.log(error.message);
    }

    return false;
};
