"use server";
import { cookies } from "next/headers";

export async function CheckTokens() {
    const Tgithub = cookies().get("tokenGithub");
    const Tclickup = cookies().get("tokenClickup");
    if (!Tgithub && !Tgithub) {
        console.log("tokenGithub and tokenClickup are not found");
        return "tokenGithub and tokenClickup are not found";
    }
    if (!Tgithub) {
        console.log("tokenGithub not found");
        return "tokenGithub not found";
    }
    if (!Tclickup) {
        console.log("tokenClickup not found");
        return "tokenClickup not found";
    }
    return "All cookies are good";
}
export async function deleteCookies() {
    try {
        cookies().delete("tokenGithub");
        cookies().delete("tokenClickup");
        cookies().delete("ClockifyWorkspace");
        cookies().delete("clockifyApiKey");
        cookies().delete("clockifyUserId");
        cookies().delete("githubRepo");
        cookies().delete("isAdmin");

        return true;
    } catch (error) {
        console.error("Failed to delete tokens:", error);
        return false;
    }
}
export const addCookies = (key, value) => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    cookies().set(key, value, {
        httpOnly: true, // Makes the cookie inaccessible to the client-side JS
        expires: oneMonthFromNow, // Set the cookie to expire after a month
    });
};
export const getAllCookies = () => {
    return cookies().getAll();
};
