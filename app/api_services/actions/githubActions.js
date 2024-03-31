"use server";
import getDocument from "@/firebase/firestore/getDocument";
import getDocumentA from "@/firebase/firestore/getDocummentA";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";
// actions.js
import axios from "axios";
import { cookies } from "next/headers";

const GITHUB_TOKEN = cookies().get("tokenGithub"); // github API token
console.log("GITHUB_TOKEN",GITHUB_TOKEN);
const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `token ${GITHUB_TOKEN?.value}`,
        Accept: "application/vnd.github.v3+json",
    },
});

// Function to get authenticated GitHub user's username
export const getGitHubUsername = async () => {
    try {
        // The '/user' endpoint returns data about the authenticated user
        const response = await githubApi.get("/user");
        const username = response.data.login; // The 'login' field contains the username
        return username;
    } catch (error) {
        console.error("Error fetching GitHub user data:", error.message);
        return null; // Or handle the error as appropriate for your application
    }
};

// Function to get the authenticated GitHub user's repositories
export const getGitHubUserRepos = async () => {
    try {
        // The '/user/repos' endpoint returns repositories for the authenticated user
        const response = await githubApi.get("/user/repos", {
            // Optional: specify the type of repositories to fetch
            params: {
                // For example, 'owner', 'public', 'private', 'member'. Default: 'owner'
                // type: "owner",
                // Optional: specify sorting method ('created', 'updated', 'pushed', 'full_name'). Default: 'full_name'
                sort: "created",
                // Optional: specify sort order if 'sort' parameter is provided ('asc' or 'desc'). Default: 'asc' when using 'full_name', 'desc' otherwise
                direction: "desc",
            },
        });
        // Process the response to extract necessary repository information
        const repos = response.data.map((repo) => ({
            name: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            language: repo.language,
            // Include other repository details as needed
        }));
        return repos;
    } catch (error) {
        console.error(
            "Error fetching GitHub user repositories:",
            error.message
        );
        return null; // Or handle the error as appropriate for your application
    }
};


// Function to fetch a specific GitHub repository name for a user from Firebase
export const getRepoFirebase = async (IdFirebase) => {
    console.log("Id:", IdFirebase);
    const response = await getDocumentA("userData", IdFirebase);
    // Assuming `getDocument` returns { result: <document data>, error: null } for successful fetch
    // and `result` is directly the data of the document.
    const githubRepo = response.result?.githubRepo;
    return githubRepo;
};


// Function to get the total number of commits by the authenticated user for the current day across all repositories
export const getTotalCommitsForToday = async (IdFirebase,githubTotalCommits) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const username = await getGitHubUsername(); // Fetch the authenticated user's username
    const TheRepo = await getRepoFirebase(IdFirebase);
    console.log("TheRepo:", TheRepo);
    let totalCommits = 0;

    try {
        const response = await githubApi.get(`/repos/${TheRepo}/commits`, {
            params: {
                since: `${today}T00:00:00Z`,
                until: `${today}T23:59:59Z`,
                author: username,
            },
        });
        totalCommits = response.data.length;
        console.log("totalCommits : ",totalCommits);
        if (totalCommits !== githubTotalCommits) {
            updateDocumentA({
                collectionName: "userData",
                id: id,
                data: { commits: githubTotalCommits },
            });
        }
    } catch (error) {
        console.error(`Error fetching commits for repo ${TheRepo}:`, error.message);
    }

    return totalCommits;
};

// export const getTotalCommitsForToday = async () => {
//     const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
//     const username = await getGitHubUsername(); // Fetch the authenticated user's username
//     const repos = await getUserRepos(); // Assume getUserRepos function is defined here or imported
//     let totalCommits = 0;

//     for (const repo of repos) {
//         try {
//             const response = await githubApi.get(
//                 `/repos/${repo.full_name}/commits`,
                  
//                 {
//                     params: {
//                         since: `${today}T00:00:00Z`,
//                         until: `${today}T23:59:59Z`,
//                         author: username,
//                     },
//                     next: { revalidate: 5 }  
//                 },
                    
//             );
//             totalCommits += response.data.length;
//         } catch (error) {
//             console.error(
//                 `Error fetching commits for repo ${repo.full_name}:`,
//                 error.message
//             );
//             // Optionally, you could choose to continue accumulating commits even if one repo fails, or handle differently
//         }
//     }

//     return totalCommits;
// };

// export const getTotalCommitsForToday = async () => {
//   const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
//   const username = await getGitHubUsername(); // Assume this fetches the authenticated user's GitHub username
//   const repos = await getUserRepos(); // Assume this fetches all user repos

//   const commitCounts = await Promise.all(repos.map(repo => 
//       githubApi.get(`/repos/${repo.full_name}/commits`, {
//           params: {
//               since: `${today}T00:00:00Z`,
//               until: `${today}T23:59:59Z`,
//               author: username,
//           },
//       }).then(response => response.data.length)
//       .catch(error => {
//           console.error(`Error fetching commits for repo ${repo.full_name}:`, error.message);
//           return 0; // Return 0 to ensure the failure of one does not affect the count of others
//       })
//   ));

//   return commitCounts.reduce((total, count) => total + count, 0);
// };
