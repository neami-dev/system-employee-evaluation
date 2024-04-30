import { db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

export default async function setDocumment({ collectionName, id, data }) {
    let result = null;
    let error = null;

    try {
        const ref = doc(db,collectionName,id);
        result = await setDoc(ref, data, { merge: true });
    } catch (e) {
        console.error("Error set document:", e);
        error = e;
    }

    return { result, error };
}
