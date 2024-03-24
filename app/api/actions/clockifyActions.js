"use server";
import axios from "axios";

const API_KEY = "YTllY2E3YjUtOGVlOS00NDZkLWFmZTctZTRjMzAyYWY5YmEx"; // Assuming the key is stored in an environment variable
const api = axios.create({
    baseURL: "https://api.clockify.me/api/v1",
    headers: { "X-Api-Key": API_KEY },
});

// Example function to get user data from Clockify
export const getClockifyUserData = async () => {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user data from Clockify:", error);
    }
};

export const getClockifyWorkSpaces = async () => {
    try {
        const response = await api.get("/workspaces");
        return response.data[0];
    } catch (error) {
        console.error("Error fetching user data from Clockify:", error);
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

    try {
        const response = await api.get(
            `/workspaces/${clockifyWorkspaceId}/user/${clockifyUserId}/time-entries?start=${date}T00:00:00Z&end=${date}T23:59:59Z`
        );

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

        return { hours, minutes, seconds };
    } catch (error) {
        console.error("Error fetching time entries:", error);
        return null;
    }
};

export const getAllUserIds = async (clockifyWorkspaceId) => {
    try {
        const response = await api.get(
            `/workspaces/${clockifyWorkspaceId}/users`
        );
        const users = response.data;
        const userIds = users.map((user) => user.id); // Extracting the user IDs
        return userIds;
    } catch (error) {
        console.error("Error fetching user IDs:", error);
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
    console.log(formattedDate);
    try {
        // Fetch time entries for the user for the specified date
        const response = await api.get(
            `/workspaces/${clockifyWorkspaceId}/user/${clockifyUserId}/time-entries?start=${formattedDate}T00:00:00Z&end=${formattedDate}T23:59:59Z`
        );

        const timeEntries = response.data;
        // console.log("timeEntries : ",timeEntries);
        if (timeEntries.length === 0) {
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
            error
        );
        return null;
    }
};
