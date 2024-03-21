import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";

export async function firebaseWithGithub() {
    const id = auth?.currentUser?.uid;
    console.log(id);
    if(id !==undefined){
        const response = await getDocument(
            "userData",
            id
        );
    const totalCommits = response.result.data()?.commits;
    console.log("totalCommits",totalCommits);
    const githubTotalCommits = await getTotalCommitsForToday();
    console.log("githubTotalCommits",githubTotalCommits);

    if (totalCommits !== githubTotalCommits) {
        const response = await updateDocument({
            collectionName: "userData",
            id:id,
            data: { commits: githubTotalCommits },
        });
        console.log("error===", response.error);
    }

    }
   

}
