"use server";
// "use server";
import admin from "../admin";

export async function getEmployees() {
    let employees = [],
        error = null;

    try {
        const listUsersResult = await admin.auth().listUsers();
        employees = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            disabled: user.disabled,
            ClockifyWorkspace: user.customClaims?.ClockifyWorkspace,
            clickupToken: user.customClaims?.clickupToken,
            clockifyApiKey: user.customClaims?.clockifyApiKey,
            clockifyUserId: user.customClaims?.clockifyUserId,
            commits: user.customClaims?.commits,
            currentTasks: user.customClaims?.currentTasks,
            customClaims: user.customClaims,
            department: user.customClaims?.department,
            githubRepo: user.customClaims?.githubRepo,
            githubToken: user.customClaims?.githubToken,
            joiningDate: user.customClaims?.joiningDate,
            metadata: {
                lastSignInTime: user.metadata.lastSignInTime,
                creationTime: user.metadata.creationTime,
                lastRefreshTime: user.metadata.lastRefreshTime,
            },
            score: user.customClaims?.score,
            // Note: passwordHash, passwordSalt, and providerData are not directly accessible and should not be exposed.
        }));
    } catch (e) {
        console.error("Error fetching employees:", e);
        error = e;
    }

    return { employees, error }; // Return simplified employee objects
}
