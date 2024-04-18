"use server";
import { cookies } from "next/headers";
import { getClockifyUserData } from "./clockifyActions";
import { auth } from "@/firebase/firebase-config";
import { checkRoleAdmin } from "@/firebase/firebase-admin/checkRoleAdmin";
import getDocument from "@/firebase/firestore/getDocummentA";

export async function checkCookies(uid) {
    try {
        const githubToken = cookies().get("githubToken")?.value;
        const clickupToken = cookies().get("clickupToken")?.value;
        const clockifyApiKey = cookies().get("clockifyApiKey")?.value;
        const clockifyWorkspace = cookies().get("clockifyWorkspace")?.value;
        const clockifyUserId = cookies().get("clockifyUserId")?.value;
        const githubRepo = cookies().get("githubRepo")?.value;
        const isAdmin = cookies().get("isAdmin")?.value;
        console.log({
            githubToken,
            clickupToken,
            clockifyApiKey,
            clockifyWorkspace,
            clockifyUserId,
            githubRepo,
            isAdmin,
        });

        if (!isAdmin) {
            console.log("isAdmin not found");
            addCookie("isAdmin", (await checkRoleAdmin(uid))?.result);
        }
        if (!clockifyUserId) {
            console.log("clockifyUserId not found");
            addCookie(
                "clockifyUserId",
                (await getDocument("userData", uid))?.result?.clockifyUserId
            );
        }
        if (!clockifyWorkspace) {
            addCookie(
                "clockifyWorkspace",
                (await getDocument("userData", uid))?.result?.clockifyWorkspace
            );
            console.log("ClockifyWorkspace not found");
        }
        if (!clockifyApiKey) {
            console.log("clockifyApiKey not found");
            addCookieServer(
                "clockifyApiKey",
                (await getDocument("userData", uid))?.result?.clockifyApiKey
            );
        }
        if (!githubRepo) {
            console.log("githubRepo not found");
            addCookie(
                "githubRepo",
                (await getDocument("userData", uid))?.result?.githubRepo
            );
        }
        if (!githubToken) {
            console.log("githubToken not found");
            addCookieServer(
                "githubToken",
                (await getDocument("userData", uid))?.result?.githubToken
            );
        }
        if (!clickupToken) {
            console.log("clickupToken not found");
            addCookie(
                "clickupToken",
                (await getDocument("userData", uid))?.result?.clickupToken
            );
        }
    } catch (error) {
        return error.message;
    }
}
export async function deleteCookies() {
    try {
        cookies().delete("githubToken");
        cookies().delete("clickupToken");
        cookies().delete("clockifyWorkspace");
        cookies().delete("clockifyApiKey");
        cookies().delete("clockifyUserId");
        cookies().delete("githubRepo");
        cookies().delete("totalCommits");
        cookies().delete("workTime");
        cookies().delete("tasksCompleted");
        cookies().delete("tasksProgress");
        cookies().delete("tasksOpen");
        cookies().delete("tasksPending");
        cookies().delete("tasksHold");
        cookies().delete("TasksOpen");
        cookies().delete("tasks");
        cookies().delete("isAdmin");
        cookies().delete("isLogged");

        return true;
    } catch (error) {
        console.error("Failed to delete tokens:", error);
        return false;
    }
}
export const getClockifyUserIdCookies = () => {
    try {
        const clockifyUserId = cookies().get("clockifyUserId")?.value;
        return clockifyUserId;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
};
export const addCookieServer = (key, value) => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    cookies().set(key, value, {
        httpOnly: true, // Makes the cookie inaccessible to the client-side JS
        expires: oneMonthFromNow, // Set the cookie to expire after a month
    });
};
export const addCookie = (key, value) => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    cookies().set(key, value, {
        expires: oneMonthFromNow, // Set the cookie to expire after a month
    });
};
export const getAllCookies = () => {
    return cookies().getAll();
};
export const getCookie = (name) => {
    return cookies().get(name);
};
