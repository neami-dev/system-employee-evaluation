
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
} from "firebase/auth";
import { auth } from "../firebase-config";

export const editEmail = async (email, newEmail, password) => {
    let result,
        error = null;
    try {
        if (auth.currentUser !== null) {
            // Reauthenticate the user before updating the email
            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await updateEmail(auth.currentUser, newEmail);
            result = true;
        }
    } catch (e) {
        error = e;
    }
    return { result, error };
};
