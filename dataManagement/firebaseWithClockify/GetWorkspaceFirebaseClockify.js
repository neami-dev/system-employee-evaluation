import getDocument from "@/firebase/firestore/getDocument";

export async function GetWorkspaceFirebaseClockify(setClockify, id) {
    try {
        console.log("check token");
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const clockifyWorkspace = response.result.data()?.clockifyWorkspace;
            if (clockifyWorkspace !== undefined) {
                setClockify(clockifyWorkspace);
                console.log("firebase workspace : " , clockifyWorkspace); // work just with return without set..., and change the file : services/page.js
                return clockifyWorkspace;
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
