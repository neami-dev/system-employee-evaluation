"use server"
import { getAuth } from 'firebase-admin/auth';
import React from 'react'

export async  function test() {
   console.log("test========");
//    getAuth()
//   .setCustomUserClaims("EAdgDXuyaXZSwlsndN9WbrEXTgD2", { admin: true })
//   .then(() => {
//     console.log("valid");
//     // The new custom claims will propagate to the user's ID token the
//     // next time a new one is issued.
//   });
getAuth()
  .getUser("EAdgDXuyaXZSwlsndN9WbrEXTgD2")
  .then((userRecord) => {
    // The claims can be accessed on the user record.
    console.log(userRecord.customClaims['admin']);
  });
}
