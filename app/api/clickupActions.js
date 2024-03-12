"use server"
// actions.js
import axios from 'axios';
import { cookies } from "next/headers";

const API_BASE_URL = 'https://api.clickup.com/api/v2';


const API_TOKEN = cookies().get("ClickupToken"); // Replace with your API token

// Setup axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': API_TOKEN.value,
    'Content-Type': 'application/json',
  },
});

// Get user's teams (workspaces)
export const getTeams = async () => {
    console.log("token : ",API_TOKEN.value);
    console.log("i'm team");
  try {
    const response = await api.get('/team');
    return response.data.teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
};

// Get spaces within a specific team (workspace)
export const getSpaces = async (teamId) => {
    console.log("teamId: ",teamId);
    console.log("hey i'm space");
    try {
      const response = await api.get(`/team/${teamId}/space`);
      return response.data.spaces;
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
      return response.data.folders;
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
      return response.data.lists;
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
      return response.data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  