import { getTotalCommitsForToday } from "@/app/api/actions/githubActions";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";

export async function firebaseWithGithub(hanldeChange, id) {
    try {
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const totalCommits = response.result.data()?.commits;
            hanldeChange(totalCommits);
            console.log("totalCommits=",totalCommits);
      
            setInterval( () => {
                 
                 getTotalCommitsForToday().then((githubTotalCommits)=>{
                    if (totalCommits !== githubTotalCommits) {
                       updateDocument({
                            collectionName: "userData",
                            id: id,
                            data: { commits: githubTotalCommits },
                        });
                    console.log("githubTotalCommits in if", githubTotalCommits);

                        return hanldeChange(githubTotalCommits);
                    }
                    console.log("githubTotalCommits", githubTotalCommits);

                });
                 
            }, 1110);
        }
    } catch (error) {
        console.log("error", error);
    }
}
