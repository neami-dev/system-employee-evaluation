import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function addDocumentById({ collectionName, id, data }) {
    let result = null,
        error = null;

    try {
        const ref = doc(db, collectionName, id);

        result = await setDoc(ref, data);
    } catch (e) {
        error = e?.message || "Error adding by id";

    }

    return { result, error };
}
