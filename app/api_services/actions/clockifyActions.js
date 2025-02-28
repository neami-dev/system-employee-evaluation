"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { addCookie, addCookieServer, getCookie } from "./handleCookies";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";

const api = () => {
    const API_KEY = cookies().get("clockifyApiKey");
    const api = axios.create({
        baseURL: "https://api.clockify.me/api/v1",
        headers: { "X-Api-Key": API_KEY?.value },
    });
    return api;
};

// function to get user data from Clockify
export const getClockifyUserData = async (api_key, uid) => {
    console.log("api-key==1", cookies().get("clockifyApiKey"));

    try {
        if (api_key) {
            const response = await axios.get(
                "https://api.clockify.me/api/v1/user",
                {
                    headers: { "X-Api-Key": api_key },
                }
            );
            console.log("status", response?.status);
            if (response?.status == 200) {
                console.log({
                    clockifyApiKey: api_key,
                    clockifyUserId: response?.data?.id,
                });
                const responseUpdate = await updateDocumentA({
                    collectionName: "userData",
                    id: uid,
                    data: {
                        clockifyApiKey: api_key,
                        clockifyUserId: response?.data?.id,
                    },
                });
                if (responseUpdate?.error !== null) {
                    addCookieServer("clockifyApiKey", api_key),
                        addCookie("clockifyUserId", response?.data?.id);
                }
                return true;
            }
        }

        return (await api().get("/user")).data;
    } catch (error) {
        console.error("Error fetching user data from Clockify:", error.message);
        return null;
    }
};

export const getClockifyWorkSpaces = async (api_key) => {
    try {
        if (api_key) {
            return (
                await axios.get("https://api.clockify.me/api/v1/workspaces", {
                    headers: { "X-Api-Key": api_key },
                })
            )?.data;
        }
        console.log(api_key);

        const response = await api().get("/workspaces");
        console.log("workspaces===", response);
        return response?.data;
    } catch (error) {
        console.error(
            "Error fetching workspaces data from Clockify:",
            error.message
        );
        console.log(api_key);
        return [];
    }
};

// Helper function to convert ISO 8601 duration to seconds
const isoDurationToSeconds = (isoDuration) => {
    let totalSeconds = 0;
    const matches = isoDuration.match(
        /P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)/
    );

    if (matches) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        const seconds = parseInt(matches[3]) || 0;
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }

    return totalSeconds;
};

// Function to get time tracked by an employee today
export const getTimeTrackedByEmployeeToday = async (
    clockifyUserId,
    clockifyWorkspaceId
) => {
    const date = new Date().toISOString().split("T")[0]; // Get today's date
    console.log("date : ", date);

    console.log("user id : ", clockifyUserId);
    console.log("workspace id : ", clockifyWorkspaceId);

    try {
        const response = await api().get(
            `/workspaces/${clockifyWorkspaceId}/user/${clockifyUserId}/time-entries?start=${date}T00:00:00Z&end=${date}T23:59:59Z`
        );

        console.log("response ==: ", response.data);
        const timeEntries = response.data;
        // console.log(timeEntries);
        let totalTimeWorkedInSeconds = 0;

        timeEntries.forEach((entry) => {
            totalTimeWorkedInSeconds += isoDurationToSeconds(
                entry.timeInterval.duration
            );
        });

        console.log("time : ", totalTimeWorkedInSeconds);

        const hours = Math.floor(totalTimeWorkedInSeconds / 3600);
        const minutes = Math.floor((totalTimeWorkedInSeconds % 3600) / 60);
        const seconds = totalTimeWorkedInSeconds % 60;
        console.log("hours", hours);
        if (hours !== getCookie("workTime")) {
            addCookie("workTime", hours);
        }
        return { hours, minutes, seconds };
    } catch (error) {
        console.error("Error fetching time entries:", error.message);
        return null;
    }
};

export const getAllUserIds = async (clockifyWorkspaceId) => {
    console.log("i'm getAllUserIds, workspace :", clockifyWorkspaceId);
    try {
        const response = await api().get(
            `/workspaces/${clockifyWorkspaceId}/users`
        );
        const users = response.data;
        return users;
    } catch (error) {
        console.error("Error fetching user IDs:", error.message);
        return [];
    }
};

// Convert ISO date-time to a more readable format (you can adjust the output format as needed)
const convertToReadableTime = (isoDateTime) => {
    return new Date(isoDateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// Function to get the check-in and check-out times for an employee for a specified date
export const getCheckInOutTimes = async (
    clockifyUserId,
    clockifyWorkspaceId,
    specificDate
) => {
    const formattedDate = specificDate.split("T")[0]; // Ensure the date is in YYYY-MM-DD format

    console.log("user id : ", clockifyUserId);
    console.log("workspace id : ", clockifyWorkspaceId);
    console.log(formattedDate);
    try {
        // Fetch time entries for the user for the specified date
        const response = await api().get(
            `/workspaces/${clockifyWorkspaceId}/user/${clockifyUserId}/time-entries?start=${formattedDate}T00:00:00Z&end=${formattedDate}T23:59:59Z`
        );

        const timeEntries = response?.data;
        // console.log("timeEntries : ",timeEntries);
        if (timeEntries?.length === 0) {
            console.log(`No time entries found for ${formattedDate}`);
            return null;
        }

        // Assuming the first entry is the check-in time and the last entry is the check-out time
        const checkInTime = convertToReadableTime(
            timeEntries[0].timeInterval.start
        );
        const checkOutTime = timeEntries[timeEntries.length - 1].timeInterval
            .end
            ? convertToReadableTime(
                  timeEntries[timeEntries.length - 1].timeInterval.end
              )
            : "In progress"; // If there's no end time for the last entry

        return {
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
        };
    } catch (error) {
        console.error(
            `Error fetching check-in/out times for ${formattedDate}:`,
            error.message
        );
        return null;
    }
};
