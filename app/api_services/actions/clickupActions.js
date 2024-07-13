"use server";
// actions.js
import axios from "axios";
import { cookies } from "next/headers";
import { addCookie, getCookie } from "./handleCookies";

// Setup axios instance with default headers
const api = () => {
    const API_BASE_URL = process.env.CLICKUP_BASE_URL;
    const API_TOKEN = cookies().get("clickupToken"); // clickup API token
    console.log("token clickup : ", API_TOKEN?.value);
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: API_TOKEN?.value,
            "Content-Type": "application/json",
        },
    });
};

// Function to get the authenticated user's details
export const getAuthenticatedUserDetails = async () => {
    console.log("i'm user func");
    try {
        const response = await api().get("/user");

        return response?.data?.user; // Adjust according to the actual response structure
    } catch (error) {
        console.error(
            "Error fetching authenticated user details:",
            error.message
        );
        return null;
    }
};

// Get user's teams (workspaces)
export const getTeams = async () => {
    console.log("i'm team");

    try {
        const response = await api().get("/team");
        // Ensure you correctly access the teams in the response
        return response.data.teams[0]; // Adjust this based on the actual response structure
    } catch (error) {
        console.error("Error fetching teams:", error.message);
        return [];
    }
};

// Get spaces within a specific team (workspace)
export const getSpaces = async (teamId) => {
    console.log("teamId: ", teamId);
    console.log("hey i'm space");
    try {
        const response = await api().get(`/team/${teamId}/space`);
        return response?.data?.spaces;
    } catch (error) {
        console.error("Error fetching spaces:", error.message);
        return [];
    }
};

// Get folders within a specific space
export const getFolders = async (spaceId) => {
    console.log("spaceId: ", spaceId);
    console.log("hey i'm folder");

    try {
        const response = await api().get(`/space/${spaceId}/folder`);
        return response?.data?.folders;
    } catch (error) {
        console.error("Error fetching folders:", error.message);
        return [];
    }
};

// Alternatively, get lists directly within a space (if no folders are used)
export const getListsInSpace = async (spaceId) => {
    console.log("spaceId: ", spaceId);
    console.log("hey i'm list");
    try {
        const response = await api().get(`/space/${spaceId}/list`);
        return response?.data?.lists;
    } catch (error) {
        console.error("Error fetching lists:", error.message);
        return [];
    }
};

// Get tasks within a specific list
export const getTasks = async (listId) => {
    console.log("listId: ", listId);
    console.log("hey i'm task");
    try {
        const response = await api().get(`/list/${listId}/task`);
        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return [];
    }
};

export const getCompletedTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ["complete"],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });
        console.log("completed tasks ", response?.data?.tasks?.length);
        if (
            response?.data?.tasks?.length !== getCookie("tasksCompleted")?.value
        ) {
            addCookie("tasksCompleted", response?.data?.tasks?.length);
        }

        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching completed tasks  :", error.message);
        return [];
    }
};

export const getInProgressTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ["in progress"],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });
        console.log("in progress tasks ", response?.data?.tasks?.length);
        if (
            response?.data?.tasks?.length !== getCookie("tasksProgress")?.value
        ) {
            addCookie("tasksProgress", response?.data?.tasks?.length);
        }
        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching in progress tasks  :", error.message);
        return [];
    }
};

export const getOpenTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ["open"],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });
        console.log("open tasks ", response?.data?.tasks?.length);

        if (response?.data?.tasks?.length !== getCookie("TasksOpen")?.value) {
            addCookie("TasksOpen", response?.data?.tasks?.length);
        }
        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching in progress tasks  :", error.message);
        return [];
    }
};

export const getPendingTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ["pending"],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });
        console.log("in pending tasks ", response?.data?.tasks?.length);
        if (
            response?.data?.tasks?.length !== getCookie("tasksPending")?.value
        ) {
            addCookie("tasksPending", response?.data?.tasks?.length);
        }
        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching pending tasks  :", error.message);
        return [];
    }
};
export const getHoldTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ["onhold"],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });
        console.log("in hold tasks ", response?.data?.tasks?.length);
        if (response?.data?.tasks?.length !== getCookie("tasksHold")?.value) {
            addCookie("tasksHold", response?.data?.tasks?.length);
        }
        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching hold tasks  :", error.message);
        return [];
    }
};
export const getRejectedTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ['rejected'],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });

        

        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching pending tasks  :", error.message);
        return null;
    }
};
export const getClosedTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                statuses: ['Closed'],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });

        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching pending tasks  :", error.message);
        return null;
    }
};
export const getAllTasksByEmployee = async (teamId, userId) => {
    try {
        const response = await api().get(`/team/${teamId}/task`, {
            params: {
                assignees: [userId],
                // statuses: ['pending'],
                // 'date_updated_gt': startIso,
                // 'date_updated_lt': endIso
            },
        });

        console.log("all tasks ", response?.data?.tasks?.length);

        if (response?.data?.tasks?.length !== getCookie("tasks")?.value) {
            addCookie("tasks", response?.data?.tasks?.length);
        }

        return response?.data?.tasks;
    } catch (error) {
        console.error("Error fetching pending tasks  :", error.message);
        return [];
    }
};
export const getTaskById = async (taskId)=>{
    try {
        const response = await api().get(`/task/${taskId}`);
        return response?.data;
    } catch (error) {
        console.error("Error fetching task by id  :", error.message);
        return [];
    }
}
