"use client";
// import React, { useEffect, useState } from "react";
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     onAuthStateChanged,
//     signOut,
// } from "firebase/auth";
// import { auth, usersCollectionRef } from "../../firebase/firebase-config";
// import { getDocs } from "firebase/firestore";

// export default function page() {
//     const [registerEmail, setRegisterEmail] = useState("");
//     const [registerPassword, setRegisterPassword] = useState("");
//     const [loginEmail, setLoginEmail] = useState("");
//     const [loginPassword, setLoginPassword] = useState("");

//     const [user, setUser] = useState({});
//     onAuthStateChanged(auth, (currentUser) => {
//         console.log(currentUser);
//         currentUser.getIdTokenResult().then((idTokenResult) => {
//             console.log(idTokenResult.claims);
//             currentUser.admin = idTokenResult.claims.admin;
//             setUser(currentUser);
//         });
//         // console.log(user);
//     });
//     // auth.onAuthStateChanged(user => {
//     //     if (user) {
//     //       user.getIdTokenResult().then(idTokenResult => {
//     //         user.admin = idTokenResult.claims.admin;
//     //         setupUI(user);
//     //       });
//     //       db.collection('guides').onSnapshot(snapshot => {
//     //         setupGuides(snapshot.docs);
//     //       }, err => console.log(err.message));
//     //     } else {
//     //       setupUI();
//     //       setupGuides([]);
//     //     }
//     //   });
//     // console.log("data");
//     useEffect(() => {
//         const getUsers = async () => {
//             const data = await getDocs(usersCollectionRef);
//             // console.log("data");
//             // console.log(
//             //     data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
//             // );
//         };

//         // getUsers();
//     }, []);
//     return (
//         <div>
//             <div>
//                 <h3> Register User </h3>
//                 <input
//                     placeholder="Email..."
//                     onChange={(event) => {
//                         setRegisterEmail(event.target.value);
//                     }}
//                 />
//                 <input
//                     placeholder="Password..."
//                     onChange={(event) => {
//                         setRegisterPassword(event.target.value);
//                     }}
//                 />

//                 <button onClick={register}> Create User</button>
//             </div>
//             <div>
//                 <h3> Login </h3>
//                 <input
//                     placeholder="Email..."
//                     onChange={(event) => {
//                         setLoginEmail(event.target.value);
//                     }}
//                 />
//                 <input
//                     placeholder="Password..."
//                     onChange={(event) => {
//                         setLoginPassword(event.target.value);
//                     }}
//                 />

//                 <button onClick={login}> Login</button>
//             </div>
//             <button onClick={logout}> Sign Out </button>
//         </div>
//     );
// }

