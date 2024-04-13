"use server";
import { cookies } from "next/headers";

export async function CheckTokens() {
    try {
        const Tokengithub = cookies().get("tokenGithub")?.value;
        const TokenClickup = cookies().get("tokenClickup")?.value;
        const clockifyApiKey = cookies().get("clockifyApiKey")?.value;
        const ClockifyWorkspace = cookies().get("ClockifyWorkspace")?.value;
        const clockifyUserId = cookies().get("clockifyUserId")?.value;
        const githubRepo = cookies().get("githubRepo")?.value;
        const isAdmin = cookies().get("isAdmin")?.value;
        if (
            !Tokengithub &&
            !TokenClickup &&
            !clockifyApiKey &&
            !ClockifyWorkspace &&
            !clockifyUserId &&
            !githubRepo &&
            !isAdmin
        ) {
            console.log("Cookies are empty");
            return "Cookies are empty";
        }
        if (!isAdmin) {
            console.log("isAdmin not found");
            return "isAdmin not found";
        }
        if (!clockifyUserId) {
            console.log("clockifyUserId not found");
            return "clockifyUserId not found";
        }
        if (!ClockifyWorkspace) {
            console.log("ClockifyWorkspace not found");
            return "ClockifyWorkspace not found";
        }
        if (!clockifyApiKey) {
            console.log("clockifyApiKey not found");
            return "clockifyApiKey not found";
        }
        if (!githubRepo) {
            console.log("githubRepo not found");
            return "githubRepo not found";
        }
        if (!Tokengithub) {
            console.log("tokenGithub not found");
            return "tokenGithub not found";
        }
        if (!TokenClickup) {
            console.log("tokenClickup not found");
            return "tokenClickup not found";
        }
        return "All cookies are good";
    } catch (error) {
        return error;
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
        cookies().delete("tasksOnHold");
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
