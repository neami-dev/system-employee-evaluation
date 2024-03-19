"use server"
// actions.js
import axios from 'axios';
import { cookies } from "next/headers";

const API_BASE_URL = process.env.CLICKUP_BASE_URL

const API_TOKEN = cookies().get("tokenClickup"); // Replace with your API token

// Setup axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': API_TOKEN?.value,
    'Content-Type': 'application/json',
  },
});


// Function to get the authenticated user's details
export const getAuthenticatedUserDetails = async () => {
  console.log("i'm user func");
  // console.log("token : ",API_TOKEN.value);
  try {
    const response = await api.get('/user');
    return response.data.user; // Adjust according to the actual response structure
  } catch (error) {
    console.error('Error fetching authenticated user details:', error);
    return null;
  }
};


// Get user's teams (workspaces)
export const getTeams = async () => {
  console.log("i'm team");
  // console.log("token : ",API_TOKEN?.value);
    try {
        const response = await api.get('/team');
        // Ensure you correctly access the teams in the response
        return response.data.teams[0]; // Adjust this based on the actual response structure
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        return [];
    }
};

// Get spaces within a specific team (workspace)
export const getSpaces = async (teamId) => {
    console.log("teamId: ",teamId);
    console.log("hey i'm space");
    try {
      const response = await api.get(`/team/${teamId}/space`);
      return response?.data?.spaces;
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };
  
  // Get folders within a specific space
  export const getFolders = async (spaceId) => {
    console.log("spaceId: ",spaceId);
    console.log("hey i'm folder");
    
    try {
      const response = await api.get(`/space/${spaceId}/folder`);
      return response?.data?.folders;
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };
  
  // Alternatively, get lists directly within a space (if no folders are used)
  export const getListsInSpace = async (spaceId) => {
    console.log("spaceId: ",spaceId);
    console.log("hey i'm list");
    try {
      const response = await api.get(`/space/${spaceId}/list`);
      return response?.data?.lists;
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };
  
  // Get tasks within a specific list
  export const getTasks = async (listId) => {
    console.log("listId: ",listId);
    console.log("hey i'm task");
    try {
      const response = await api.get(`/list/${listId}/task`);
      return response?.data?.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  export const getCompletedTasksByEmployee = async (teamId, userId) => {
    console.log("completed tasks ");
  
    try {
      const response = await api.get(`/team/${teamId}/task`, {
        params: {
          assignees: [userId],
          statuses: ['completed'], 
          // 'date_updated_gt': startIso,
          // 'date_updated_lt': endIso
        }
      });
      return response?.data?.tasks;
    } catch (error) {
      console.error('Error fetching completed tasks  :', error);
      return [];
    }
  };
  
  
  export const getInProgressTasksByEmployee = async (teamId, userId) => {
    console.log("in progress tasks ");
  
    try {
      const response = await api.get(`/team/${teamId}/task`, {
        params: {
          assignees: [userId],
          statuses: ['in progress'], 
          // 'date_updated_gt': startIso,
          // 'date_updated_lt': endIso
        }
      });
      return response?.data?.tasks;
    } catch (error) {
      console.error('Error fetching in progress tasks  :', error);
      return [];
    }
  };

  export const getPendingTasksByEmployee = async (teamId, userId) => {
    console.log("in pending tasks ");
  
    try {
      const response = await api.get(`/team/${teamId}/task`, {
        params: {
          assignees: [userId],
          statuses: ['pending'], 
          // 'date_updated_gt': startIso,
          // 'date_updated_lt': endIso
        }
      });
      return response?.data?.tasks;
    } catch (error) {
      console.error('Error fetching pending tasks  :', error);
      return [];
    }
  };
  export const getAllTasksByEmployee = async (teamId, userId) => {
  
    try {
      const response = await api.get(`/team/${teamId}/task`, {
        params: {
          assignees: [userId],
          // statuses: ['pending'], 
          // 'date_updated_gt': startIso,
          // 'date_updated_lt': endIso
        }
      });
      return response?.data?.tasks;
    } catch (error) {
      console.error('Error fetching All tasks  :', error);
      return [];
    }
  };


