import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";

export async function firebaseWithGithub(hanldeChange, id) {
    try {
        console.log(id);
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const totalCommits = response.result.data()?.commits;
            hanldeChange(totalCommits);
            const githubTotalCommits = await getTotalCommitsForToday();
            if (totalCommits !== githubTotalCommits) {
                await updateDocument({
                    collectionName: "userData",
                    id: id,
                    data: { commits: githubTotalCommits },
                });
                return hanldeChange(githubTotalCommits);
            }
            
        }
    } catch (error) {
        console.log("error", error);
    }
}
