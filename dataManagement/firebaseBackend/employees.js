"use server"

import { getEmployees } from "@/firebase/firebase-admin/getEmployees";

export async  function employees() {
    const response = await getEmployees();
    console.log("response===",response);
    return response;
    
}
employees()