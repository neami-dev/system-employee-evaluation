"use server";
import admin from "../admin";
export async function getEmployees() {
    let result,
        error = null;
    // List all users
    try {
        result = await admin.auth().listUsers();
    } catch (e) {
        error = e;
    }
    return { result, error };
}
