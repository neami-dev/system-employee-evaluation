import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function signIn({ email, password }) {
    let result = null,
        error = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
