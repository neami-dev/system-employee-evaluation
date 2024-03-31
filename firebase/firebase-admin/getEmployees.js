"use server";
import { getAuth } from "firebase-admin/auth";

export async function getEmployees() {
    let result = [];
    let error = null;

    try {
        let pageToken = undefined;
        do {
            const listUsersResult = await getAuth().listUsers(1000, pageToken);
            listUsersResult.users.forEach((userRecord) => {
                result.push(userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
                pageToken = listUsersResult.pageToken;
            } else {
                pageToken = null;
            }
        } while (pageToken);
    } catch (err) {
        error = err;
    }
  
    return { result, error };
}
