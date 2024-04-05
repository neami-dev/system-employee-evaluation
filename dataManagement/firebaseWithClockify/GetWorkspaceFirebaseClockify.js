import getDocument from "@/firebase/firestore/getDocument";

export async function GetWorkspaceFirebaseClockify(setClockify, id) {
    try {
        console.log("check token");
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const clockifyApiKey = response.result.data()?.ClockifyWorkspace;
            if (clockifyApiKey !== undefined) {
                setClockify(true);
                return true;
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
