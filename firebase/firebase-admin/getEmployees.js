"use server"
import admin from '../admin'; // Adjust the import path to where you initialize Firebase Admin
export async function  getEmployees() {
     
// List all users
admin
  ?.auth()
  ?.listUsers()
  ?.then((listUsersResult) => {
    listUsersResult.users.forEach((userRecord) => {
      console.log('user', userRecord.toJSON());
    });
  })
  .catch((error) => {
    console.error('Error listing users:', error);
  });

  
}
