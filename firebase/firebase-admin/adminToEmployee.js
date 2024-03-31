"use server";

import { getAuth } from "firebase-admin/auth";

export async function adminToEmployee(uid) {
    let result,
        error = null;
    try {
        result = getAuth().setCustomUserClaims(uid, { admin: false });
    } catch (e) {
        error = e?.message || "Invalid";
    }
    return { result, error };
}
