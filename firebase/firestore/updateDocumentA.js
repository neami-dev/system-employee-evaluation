"use server"
import admin from "../admin"; // Adjust this path if necessary

export default async function updateDocumentA({ collectionName, id, data }) {
    let result = null;
    let error = null;

    try {
        const db = admin.firestore();
        const ref = db.collection(collectionName).doc(id);
        
        // Using the set method with {merge: true} to mimic updateDoc behavior
         await ref.set(data, { merge: true });
         result = true;
    } catch (e) {
        console.error("Error updating document:", e);
        error = e;
    }

    return { result, error };
}
