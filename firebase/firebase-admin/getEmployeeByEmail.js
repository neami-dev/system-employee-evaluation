"use server";

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
initializeApp();

export async function getEmployeeByEmail(email) {
    let result,
        error = null;
    try {
        console.log("result--");
        const userRecord = await getAuth().getUserByEmail("kabir@gmail.com");
        result = userRecord.toJSON();
        console.log("result---", result);
    } catch (e) {
        error = e.message;
        console.log(e);
    }
    return { result, error };
}
