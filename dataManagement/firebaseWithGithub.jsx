import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import updateDocument from "@/firebase/firestore/updateDocument";

export async function firebaseWithGithub() {
    const GithubTotalCommits = await getTotalCommitsForToday();
    console.log("GithubTotalCommits", GithubTotalCommits);
    if (GithubTotalCommits !== 1) {
        const response = await updateDocument({
            collectionName: "userData",
            id: "xRcfN17VH6YMHRK8dceKd3WURgM2",
            data: { score: 90 },
        });
        console.log("result===", response.result);
        console.log("error===", response.error);
    }

    return <div>firebaseWithGithub</div>;
}
