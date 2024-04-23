// "use server"
import admin from "firebase-admin";

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: "https://your-database-url.firebaseio.com" // Only needed for Firebase Realtime Database
    });
}

export default  admin;
