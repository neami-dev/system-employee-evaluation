import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import addDocumentById from "@/firebase/firestore/addDocumentById";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";
import { setDoc } from "firebase/firestore";


export async function GetTokenFirebaseGithub(setGithub,id) {
    try {
        console.log("check token");
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const GithubToken = response.result.data()?.githubToken;
            if (GithubToken !== undefined) {
                setGithub(true)
                return true
            } else {
                setGithub(false)
                console.log("error : ",err.message)
            }
        } else {
            return "undefined Id"
        }
    } catch (error) {
        console.log("error", error.message);
        return "error"
    }
}
