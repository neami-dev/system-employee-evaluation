import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default async function signUp({ email, password, fullName }) {
    let result = null,
        error = null;

    const data = {
        department: "",
        score: 0,
        skills:[],
        whoIAm : "",
    };

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: fullName,
          
        });

        const userRef = doc(db, "userData", result.user.uid);
        const methodoRef = doc(db, "methodologyOfWork", result.user.uid);
        const attrRef = doc(db, "attributes", result.user.uid);

        await setDoc(userRef, data);
        // await setDoc(methodoRef);
        // await setDoc(attrRef);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
