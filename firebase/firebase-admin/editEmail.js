
import { getAuth, updateEmail } from "firebase/auth";

export async function editEmail(newEmail) {
    const auth = getAuth();
    updateEmail(auth.currentUser, newEmail).then(() => {
      // Email updated!
      console.log("Email updated!");
    }).catch((error) => {
      // An error occurred
      console.log("An error occurred", error);
    });
}
