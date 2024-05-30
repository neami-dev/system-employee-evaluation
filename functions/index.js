import * as functions from "firebase-functions";

const afterCreateUser = functions.auth.user().onCreate((user)=>{
    console.log("added new user: " , user?.email);
})