"use server";
import { getAuth } from "firebase-admin/auth";

export async function deleteEmployee(id) {
    let result,
        error = null;

    try {
        result = await getAuth().deleteUser(id);
    } catch (e) {
        error = e
    }
}
