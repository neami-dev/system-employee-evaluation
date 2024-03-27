"use server"

import { SetTokenfirebaseClickup } from "@/dataManagement/firebaseWithClickup/SetTokenfirebaseClickup.js";
// import { auth } from "@/firebase/firebase-config";
// import { getAuthenticatedUserDetails, getTeams } from "@/app/api/actions/clickupActions.js";
import { cookies } from "next/headers";

export default async function ClickupTokenHandler(code,uid) {
    console.log("code : ",code);
    console.log("uid : ",uid);
    try {
      const tokenResponse = await fetch(`${process.env.CLICKUP_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID,
          client_secret: process.env.CLICKUP_CLIENT_SECRET,
          code,
        }),
      });
      console.log("fetched");
      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        
        console.log("the token is here : ", tokenData.access_token);
        cookies().set("tokenClickup", tokenData.access_token)
        
        const setToken = await SetTokenfirebaseClickup(uid,tokenData.access_token)
        console.log("setTOken : ",setToken);
        if (setToken == "OK") {
          return true
        } else if (setToken == "FAILED") {
          console.log("failed setting the token in firebase");
          return "failed setting the token in firebase"
        }
      } else {
        console.log("token exchange failed");
        return "Token exchange failed"
      }
    } catch (error) {
      console.log(error.message);
      return error.message
    }
  }
  