import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function deleteDocumentById( collectionName, id ) {
    let result = null,
        error = null;

    try {
        const ref = doc(db, collectionName, id);

        result = await deleteDoc(ref);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
