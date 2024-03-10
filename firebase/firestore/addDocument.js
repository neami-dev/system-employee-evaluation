import { db } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";

// Function to add data to a Firestore
export default async function addDocument(collectionName, data) {
    let result = null,
        error = null;

    try {
        result = await addDoc(collection(db,collectionName), data);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
