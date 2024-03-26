"use server";

import { getAuth } from "firebase-admin/auth";

export async function createEmployee({
    email,
    emailVerified = false,
    phoneNumber,
    password,
    displayName,
    photoURL,
    disabled = false,
}) {
    let result,
        error = null;

    try {
        result = await getAuth().createUser({
            email,
            emailVerified,
            phoneNumber,
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
