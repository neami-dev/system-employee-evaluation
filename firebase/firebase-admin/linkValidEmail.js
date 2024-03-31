"use server";

import { getAuth } from "firebase-admin/auth";

export async function linkValidEmail(email) {
    let result,
        error = null;

    try {
        result = await getAuth().generateEmailVerificationLink(email, {
            url: "http://localhost:3000/employee/dashboard",
        });
    } catch (e) {
        error = e.message || "Error";
    }
    return { result, error };
}
