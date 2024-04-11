import { updateProfile } from "firebase/auth";
import { auth } from "../firebase-config";

export async function editProfile({ displayName, photoURL }) {
    let result,
        error = null;

    try {
        await updateProfile(auth?.currentUser, {
            displayName,
            photoURL,
        });
        result = true;
    } catch (e) {
        error = e;
    }
    return { result, error };
}
