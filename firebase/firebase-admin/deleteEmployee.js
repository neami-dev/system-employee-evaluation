"use server";
import { getAuth } from "firebase-admin/auth";

export async function deleteEmployee(uid) {
    let result,
        error = null;

    try {
        result = await getAuth().deleteUser(uid);

    } catch (e) {
        error = e?.message || "Error deleting employee"
    }
    return { result, error };
}
