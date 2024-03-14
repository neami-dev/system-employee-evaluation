"use server"
import { cookies } from "next/headers";
import { getAuthenticatedUserDetails, getTeams } from "../actions/clickupActions";

export default async function handleTokenStorage(token) {
    // Assume token is already stored in cookies by now
    cookies().set("tokenClickup", token);

    try {
        // Fetch and store userId
        // const userDetails = await getAuthenticatedUserDetails();
        // if (userDetails && userDetails.id) {
        //     cookies().set("userIdClickup", userDetails.id);
        // }

        // Fetch and store teamId
        const teams = await getTeams();
        console.log("all teams : ",teams);
        if (teams && teams.length > 0) {
            // Assuming you're interested in the first team
            const teamId = teams[0].id;
            console.log("teamId : ",teamId);
            cookies().set("teamIdClickup", teamId);
        }
    } catch (error) {
        console.error('Error storing userId or teamId in cookies:', error);
    }
}
