
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

// Function to retrieve a document from a Firestore collection
export default async function getDocument({collectionName, id}) {
   
  const docRef = doc(db, collectionName, id);
   
  let result = null ,error = null;

  try {
   
    result = await getDoc(docRef);
  } catch (e) {
     
    error = e;
  }
   
  return { result, error };
}