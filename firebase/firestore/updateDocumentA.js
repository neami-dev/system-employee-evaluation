"use server"
import { getFirestore } from "firebase/firestore";
// import admin from "../admin"; // Adjust this path if necessary

export default async function updateDocumentA({ collectionName, id, data }) {
    let result = null;
    let error = null;

    try {
       const fireStore = getFirestore();

        // const db = admin.firestore();
        const ref = fireStore.collection(collectionName).doc(id);
        
        // Using the set method with {merge: true} to mimic updateDoc behavior
         await ref.set(data, { merge: true });
         result = true;
    } catch (e) {
        console.error("Error updating document:", e);
        error = e;
    }

    return { result, error };
}
