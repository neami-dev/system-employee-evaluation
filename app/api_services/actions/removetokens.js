"use server"
import { cookies } from "next/headers";


export async function CheckTokens() {
    const Tgithub = cookies().get("tokenGithub")
    const Tclickup = cookies().get("tokenClickup")
    if (!Tgithub && !Tgithub) {
        console.log("tokenGithub and tokenClickup are not found");
        return "tokenGithub and tokenClickup are not found"
    }
    if (!Tgithub) {
        console.log("tokenGithub not found");
        return "tokenGithub not found"
    }
    if (!Tclickup) {
        console.log("tokenClickup not found");
        return "tokenClickup not found"
    }
    return "All cookies are good"
}
export default async function removetokens() {
    try {
        cookies().delete("tokenGithub");
        cookies().delete("tokenClickup")
        return true;
    } catch (error) {
        console.error("Failed to delete tokens:", error);
        return false;
    }
}
