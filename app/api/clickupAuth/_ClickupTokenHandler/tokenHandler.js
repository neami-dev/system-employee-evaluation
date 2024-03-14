"use server"

// import { getAuthenticatedUserDetails, getTeams } from "@/app/api/actions/clickupActions.js";
import { cookies } from "next/headers";

export default async function ClickupTokenHandler(code) {
    console.log("code : ",code);
    try {
      const tokenResponse = await fetch('https://api.clickup.com/api/v2/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.CLICKUP_CLIENT_ID,
          client_secret: process.env.CLICKUP_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        
        console.log("the token is here : ", tokenData.access_token);
        cookies().set("tokenClickup",tokenData.access_token)
        
        return true
      } else {
        return "Token exchange failed"
      }
    } catch (error) {
      
      return error.message
    }
  }
  