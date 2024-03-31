"use server";

import { getAuth } from "firebase-admin/auth";

export async function employeeToAdmin(uid) {
    let result,
        error = null;
    try {
        result = getAuth().setCustomUserClaims(uid, { admin: true });
    } catch (e) {
        error = e?.message || "Invalid";
    }
    return { result, error };
}
