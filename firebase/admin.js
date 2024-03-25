import admin from "firebase-admin"
import serviceAccount from "./system-employee-evaluation-firebase-adminsdk-p9qpp-e8ad626791.json"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://your-database-url.firebaseio.com" // Only needed for Firebase Realtime Database
  });
}

module.exports = admin;