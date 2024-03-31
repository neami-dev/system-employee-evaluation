import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

// Function to retrieve a document from a Firestore collection
export default async function getDocument(collectionName, id) {
  const docRef = doc(db, collectionName, id);

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      // Document found, return its data
      const result = docSnapshot.data();
      return { result, error: null };
    } else {
      // Document not found
      return { result: null, error: "Document not found" };
    }
  } catch (e) {
    // Handle any errors that occurred during getDoc
    return { result: null, error: e?.message || "Error fetching document" };
  }
}
