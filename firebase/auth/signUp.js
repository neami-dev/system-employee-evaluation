import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default async function signUp({ email, password, fullName, photoURL }) {
    let result = null,
        error = null;

    const data = {
        department: null,
        joiningDate: new Date(),
        score: 0,
    };

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: fullName,
            photoURL: photoURL,
        });

        const userRef = doc(db, "userData", result.user.uid);

        await setDoc(userRef, data);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
