"use client"
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase-config";

export async function confirmPassword(code,newPassword) {
    if (code) {
        let result,
            error = null;
        try {
            result = await confirmPasswordReset(auth, code,"123456");
            console.log("result ====", result);
        } catch (e) {
            error = e;
            console.log(e);
        }
    }
}
