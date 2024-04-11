import { applyActionCode, getAuth, sendEmailVerification } from "firebase/auth";


export async function sendVerifyResetEmail() {

    const auth = getAuth();
    sendEmailVerification(auth.currentUser)
       applyActionCode()
}
