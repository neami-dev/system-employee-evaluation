import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function updateDocument({ collectionName, id, data }) {
    let result = null,
        error = null;

    try {
        const ref = doc(db, collectionName, id);

        result = await updateDoc(ref, data);

    } catch (e) {
        error = e;
    }

    return { result, error };
}
