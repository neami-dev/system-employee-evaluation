"use server";

import { getAuth } from "firebase-admin/auth";
let result = null,
    error = null;
export async function checkRoleAdmin(uid) {
    try {
        const response = await getAuth().getUser(uid);
        if (response?.customClaims?.admin == true) {
            result = true;
        } else {
            result = false;
        }
    } catch (e) {
        error = e.message || "Error";
    }

    return { result, error };
}
