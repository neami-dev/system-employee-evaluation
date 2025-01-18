// "use server"
import admin from "firebase-admin";

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};

// Debug: Log the environment variables
console.log("Firebase Admin Config:");
console.log({
    projectId: serviceAccount.projectId,
    privateKey: serviceAccount.privateKey ? "Loaded" : "Not Loaded",
    clientEmail: serviceAccount.clientEmail,
    storageBucket: serviceAccount.storageBucket,
});

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: serviceAccount.storageBucket,
    });
}

export default admin;
