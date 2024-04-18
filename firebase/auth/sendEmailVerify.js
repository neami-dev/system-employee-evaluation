import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase-config";

export async function sendEmailVerify() {
    let result = false;
    let error = null;
    try {
        await sendEmailVerification(auth?.currentUser,{url:"http://localhost:3000/employee/settings"});
        result = true;
    } catch (e) {
        error = e;
    }
    return { result, error };
}
