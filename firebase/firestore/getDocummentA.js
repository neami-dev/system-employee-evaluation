import admin from '../admin'; // Adjust the import path to where you initialize Firebase Admin

// Function to retrieve a document from a Firestore collection using Firebase Admin SDK
export default async function getDocumentA(collectionName, id) {
  const db = admin.firestore(); // Get the Admin Firestore instance
  const docRef = db.collection(collectionName).doc(id);

  let result = null, error = null;

  try {
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      result = docSnapshot.data(); // Access the document's data if it exists
    } else {
      console.log('No document found with the given ID.');
      result = 'No document found'; // Or handle as appropriate for your application
    }
  } catch (e) {
    console.error('Error getting document:', e);
    error = e;
  }

  return { result, error };
}
