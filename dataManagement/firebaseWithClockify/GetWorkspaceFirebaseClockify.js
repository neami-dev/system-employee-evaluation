import getDocument from "@/firebase/firestore/getDocument";

export async function GetWorkspaceFirebaseClockify(setClockify, id) {
    try {
        console.log("check token");
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const ClockifyWorkspace = response.result.data()?.ClockifyWorkspace;
            if (ClockifyWorkspace !== undefined) {
                setClockify(ClockifyWorkspace);
                console.log("firebase workspace : " , ClockifyWorkspace); // work just with return without set..., and change the file : services/page.js
                return ClockifyWorkspace;
            } else {
                setClockify(false);
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
