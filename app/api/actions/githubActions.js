"use server"
// actions.js
import axios from 'axios';
import { cookies } from "next/headers";

const GITHUB_TOKEN = cookies().get("tokenGithub"); // github API token


const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN.value}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});

// Function to get authenticated GitHub user's username
export const getGitHubUsername = async () => {
  try {
    // The '/user' endpoint returns data about the authenticated user
    const response = await githubApi.get('/user');
    const username = response.data.login; // The 'login' field contains the username
    return username;
  } catch (error) {
    console.error('Error fetching GitHub user data:', error.message);
    return null; // Or handle the error as appropriate for your application
  }
};

// Function to get the authenticated GitHub user's repositories
export const getGitHubUserRepos = async () => {
    try {
      // The '/user/repos' endpoint returns repositories for the authenticated user
      const response = await githubApi.get('/user/repos', {
        // Optional: specify the type of repositories to fetch
        params: {
          // For example, 'owner', 'public', 'private', 'member'. Default: 'owner'
          type: 'owner',
          // Optional: specify sorting method ('created', 'updated', 'pushed', 'full_name'). Default: 'full_name'
          sort: 'created',
          // Optional: specify sort order if 'sort' parameter is provided ('asc' or 'desc'). Default: 'asc' when using 'full_name', 'desc' otherwise
          direction: 'desc'
        }
      });
      // Process the response to extract necessary repository information
      const repos = response.data.map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        language: repo.language,
        // Include other repository details as needed
      }));
      return repos;
    } catch (error) {
      console.error('Error fetching GitHub user repositories:', error.message);
      return null; // Or handle the error as appropriate for your application
    }
  };
  
