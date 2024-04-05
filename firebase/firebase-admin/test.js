"use server"
import {sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";

export async function test() {

    
    sendPasswordResetEmail(auth, "barticerta@gufum.com")
      .then(() => {
        // Password reset email sent!
        console.log("Password reset email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage);
        // ..
      });
}
