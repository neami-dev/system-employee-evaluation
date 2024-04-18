"use server";

import { getAuth } from "firebase-admin/auth";

export function getEmployee(uid) {
    let result,
        error = null;
    try {
        const userRecord = getAuth().getUser(uid);
        result = userRecord.toJSON();
    } catch (e) {
        error = e;
    }
    return { result, error };
}
