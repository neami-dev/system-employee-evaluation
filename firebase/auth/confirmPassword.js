"use client";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase-config";

export async function confirmPassword(code, newPassword) {
    let result,
        error = null;
    if (code) {
        try {
            result = await confirmPasswordReset(auth, code, newPassword);
        } catch (e) {
            error = e;
        }
    }
    return { result, error };
}
