"use server"
import React from 'react'
import {admin} from "../admin"
export async function  getEmployees() {
     
// List all users
admin
  .auth()
  .listUsers()
  .then((listUsersResult) => {
    listUsersResult.users.forEach((userRecord) => {
      console.log('user', userRecord.toJSON());
    });
  })
  .catch((error) => {
    console.error('Error listing users:', error);
  });

  
}
