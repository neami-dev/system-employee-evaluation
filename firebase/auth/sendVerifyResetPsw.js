import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";

export async function sendVerifyResetPsw(email) {
    let result,
        error = null;
    try {
        result = await sendPasswordResetEmail(auth, email,{url:"http://localhost:3000/password-set"});
    } catch (e) {
        error = e;
    }
    return { result, error };
}
