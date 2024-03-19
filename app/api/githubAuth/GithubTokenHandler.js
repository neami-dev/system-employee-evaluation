"use server"

import { cookies } from "next/headers";

export default async function GithubTokenHandler(code) {
    console.log("code : ",code);
    try {
      const tokenResponse = await fetch(`${process.env.GITHUB_BASE_URL}/oauth/access_token`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json', // Requesting the response in JSON format
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      console.log("fetched");
      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        
        console.log("the token is here : ", tokenData.access_token);
        cookies().set("tokenGithub", tokenData.access_token)
        
        return true
      } else {
        console.log("token exchange failed");
        return "Token exchange failed"
      }
    } catch (error) {
      console.log(error.message);
      return error.message
    }
  }
  