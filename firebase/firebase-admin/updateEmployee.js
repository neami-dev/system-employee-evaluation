"use server";
import { getAuth } from "firebase-admin/auth";

export async function updateEmployee({
    uid,
    email,
    phoneNumber,
    emailVerified,
    password,
    displayName,
    photoURL,
    disabled,
}) {
    let result = false;
    let error = null;

    try {
        result = !!getAuth().updateUser(uid, {
            email,
            phoneNumber,
            emailVerified,
            password,
            displayName,
            photoURL,
            disabled,
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}
