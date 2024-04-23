"use server"

// import admin from "../admin"; // Adjust this path if necessary
import admin from  'firebase-admin'

export default async function updateDocumentA({ collectionName, id, data }) {
    let result = null;
    let error = null;

    try {
       

        // const db = admin.firestore();
        const ref = admin.firestore().collection(collectionName).doc(id);
        
        // Using the set method with {merge: true} to mimic updateDoc behavior
         await ref.update(data);
         result = true;
    } catch (e) {
        console.error("Error updating document:", e);
        error = e;
    }

    return { result, error };
}
