"use server"
// import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import addDocumentById from "@/firebase/firestore/addDocumentById";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";
import updateDocumentA from "@/firebase/firestore/updateDocumentA";


export async function setWorkSpaceIdfirebaseClockify(clockifyWorkspace,id) {
    try {
        if (id !== undefined) {
            console.log("id is good");

            try {
                // Using await to ensure execution waits for updateDocumentA to complete
                await updateDocumentA({
                    collectionName: "userData",
                    id: id,
                    data: { clockifyWorkspace: clockifyWorkspace },
                });
                console.log("OK");
                return {status : "OK"};
            } catch (err) {
                console.log("error : ", err.message);
                return "FAILED"; // Returning "FAILED" if an error occurs
            }
        } else {
            return "undefined Id";
        }
    } catch (error) {
        console.log("error", error.message);
        return "error"; // Returning "error" if an unexpected error occurs
    }
}
