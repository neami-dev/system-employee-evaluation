import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function getDocuments(collectionName) {
    let result = null,
        error = null;

    try {
        result = await getDocs(collection(db, collectionName));
    } catch (e) {
        error = e;
    }

    return { result, error };
}
