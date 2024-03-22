"use server";
import axios from 'axios';

const API_KEY = "YTllY2E3YjUtOGVlOS00NDZkLWFmZTctZTRjMzAyYWY5YmEx"; // Assuming the key is stored in an environment variable
const api = axios.create({
  baseURL: 'https://api.clockify.me/api/v1',
  headers: { 'X-Api-Key': API_KEY },
});

// Example function to get user data from Clockify
export const getClockifyUserData = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data from Clockify:', error);
  }
};

export const getClockifyWorkSpaces = async () => {
    try {
      const response = await api.get('/workspaces');
      return response.data[0];
    } catch (error) {
      console.error('Error fetching user data from Clockify:', error);
    }
  };

// Helper function to convert ISO 8601 duration to seconds
const isoDurationToSeconds = (isoDuration) => {
    let totalSeconds = 0;
    const matches = isoDuration.match(/P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)/);
  
    if (matches) {
      const hours = parseInt(matches[1]) || 0;
      const minutes = parseInt(matches[2]) || 0;
      const seconds = parseInt(matches[3]) || 0;
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }
  
    return totalSeconds;
  };
  
  // Function to get time tracked by an employee today
  export const getTimeTrackedByEmployeeToday = async (clockifyUserId, clockifyWorkspaceId) => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date
    console.log("date : ",date);
  
    try {
      const response = await api.get(`/workspaces/${clockifyWorkspaceId}/user/${clockifyUserId}/time-entries?start=${date}T00:00:00Z&end=${date}T23:59:59Z`);
  
      const timeEntries = response.data;
      // console.log(timeEntries);
      let totalTimeWorkedInSeconds = 0;
  
      timeEntries.forEach(entry => {
        totalTimeWorkedInSeconds += isoDurationToSeconds(entry.timeInterval.duration);
      });
      
      console.log("time : ", totalTimeWorkedInSeconds);

      const hours = Math.floor(totalTimeWorkedInSeconds / 3600);
      const minutes = Math.floor((totalTimeWorkedInSeconds % 3600) / 60);
      const seconds = totalTimeWorkedInSeconds % 60;
  
      return {hours,minutes,seconds};
    } catch (error) {
      console.error('Error fetching time entries:', error);
      return null;
    }
  };

export const getAllUserIds = async (clockifyWorkspaceId) => {
    try {
        const response = await api.get(`/workspaces/${clockifyWorkspaceId}/users`);
        const users = response.data;
        const userIds = users.map(user => user.id); // Extracting the user IDs
        return userIds;
    } catch (error) {
        console.error('Error fetching user IDs:', error);
        return [];
    }
};