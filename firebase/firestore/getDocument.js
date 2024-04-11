
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

// Function to retrieve a document from a Firestore collection
export default async function getDocument(collectionName, id) {
   
  const docRef = doc(db, collectionName, id);
   
  let result ,error = null;

  try {
   
    result = await getDoc(docRef);
  } catch (e) {
     
    error = e?.message || "Error getting";
    console.log(e);
  }
   
  return { result, error };
}