import { getTotalCommitsForToday } from "@/app/api_services/actions/githubActions";
import addDocumentById from "@/firebase/firestore/addDocumentById";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";
import { setDoc } from "firebase/firestore";

export async function GetTokenfirebaseClickup(setClickup, id) {
    try {
        console.log("check token");
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const clickupToken = response.result.data()?.clickupToken;
            if (clickupToken !== undefined) {
                setClickup(true);
                return true;
            } else {
                setClickup(false);
                console.log("error : ", err.message);
            }
        } else {
            return "undefined Id";
        }
    } catch (error) {
        console.log("error", error.message);
        return "error";
    }
}
