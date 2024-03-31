"use server";

import { getAuth } from "firebase-admin/auth";
let result = false,
    error = null;
export async function checkRoleAdmin(uid) {
    try {
        const user = await getAuth().getUser(uid);
        result = !!user.customClaims?.admin;
    } catch (e) {
        error = e.message || "Error";
    }

    return { result, error };
}
