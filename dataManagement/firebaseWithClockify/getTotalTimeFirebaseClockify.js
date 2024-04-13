import { getClockifyUserData, getTimeTrackedByEmployeeToday } from "@/app/api_services/actions/clockifyActions";
import { getTotalCommitsForToday } from "@/app/api_services/actions/githubActions";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";
//test
export async function getTotalTimeFirebaseClockify(hanldeChange, uid) {
    try {
        console.log("i'm getTotalTime func");
        if (uid !== undefined) {
            const response = await getDocument("userData", uid);
            const workingTime = response.result.data()?.workingTime;
            const hours = Math.floor(workingTime / 3600);
            const minutes = Math.floor((workingTime % 3600) / 60);
            const seconds = workingTime % 60;
            // return { hours, minutes, seconds };
            hanldeChange({ hours, minutes, seconds });
            
            const ClockifyUserData = await getClockifyUserData();
            console.log("ClockifyUserData", ClockifyUserData);
            const ClockifyWorkspace = response.result.data()?.ClockifyWorkspace;
            // const interval = setInterval(() => {
                getTimeTrackedByEmployeeToday(ClockifyUserData?.id,ClockifyWorkspace,id,workingTime).then((totalTime) => {
                    return hanldeChange(totalTime);
                });
            // }, 2000);
            // return () => {
            //     clearInterval(interval);
            // };
        }
    } catch (error) {
        console.log("error", error);
    }
}
