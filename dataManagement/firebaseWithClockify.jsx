
import { getClockifyUserData, getClockifyWorkSpaces, getTimeTrackedByEmployeeToday } from "@/app/api/actions/clockifyActions";
import getDocument from "@/firebase/firestore/getDocument";
import updateDocument from "@/firebase/firestore/updateDocument";


export async function firebaseGetClockifyUserId(id) {
    try {
        console.log("i' fireCLock id :",id);

        if (id !== undefined) {
        const response = await getDocument("userData",id)
        console.log("resp : ",response.result.data());
        const clockifyUserId = response.result.data()?.clockifyUserId
        console.log("ClockifyUserDataId :",clockifyUserId);

        if (clockifyUserId == undefined) {
                console.log("first clock undefined");
                const clockifyUserId = await getClockifyUserData();
                console.log("clockifyUserId", clockifyUserId.id);
                // const id2 = "65f45d9f5489a9380ca9c849";
                updateDocument({
                     collectionName: "userData",
                     id: id,
                     data: { clockifyUserId: clockifyUserId.id },
                 }).then((id) => {
                    return id
                 }).catch((err)=> console.log("error : ",err.message))
        } else {
            return clockifyUserId
        }
    }
    } catch (error) {
        console.log("error", error.message);
    }
}

export async function firebaseGetClockifyWorkSpaceId(id) {
    try {
        if (id !== undefined) {
        const response = await getDocument("userData",id)
        const clockifyWorkSpaceId = response.result.data()?.clockifyWorkSpaceId
        console.log("clockifyWorkSpaceId : " ,clockifyWorkSpaceId);
        if (clockifyWorkSpaceId !== undefined) {
    
                const clockifyWorkSpaceId = await getClockifyWorkSpaces();
                // console.log("clockifyWorkSpaceId", clockifyWorkSpaceId.id);
                // const id2 = "65f45d9f5489a9380ca9c849";
                updateDocument({
                     collectionName: "userData",
                     id: id,
                     data: { clockifyWorkSpaceId: clockifyWorkSpaceId.id },
                 }).then((id) => {
                    return id
                 }).catch((err)=> console.log("error : ",err.message))
        } else {
            return clockifyWorkSpaceId
        }
    }
    } catch (error) {
        console.log("error", error.message);
    }
}

export async function firebaseWithClockify(hanldeChange, id) {
    try {
        console.log('id :',id);
        if (id !== undefined) {
            const response = await getDocument("userData", id);
            const totalTime = response.result.data()?.workTimeHours;
            console.log("totalTime:",totalTime);
            if (totalTime !== undefined) {
                hanldeChange(totalTime);
            } else {
                const ClockifyUserDataId = await firebaseGetClockifyUserId(id);
                console.log("ClockifyUserDataId :",ClockifyUserDataId);
                const ClockifyWorkSpaceId = await firebaseGetClockifyWorkSpaceId(id);
                console.log("ClockifyWorkSpaceId :",ClockifyWorkSpaceId);
                setInterval( () => {
                    // console.log("ClockifyUserData", ClockifyUserData);
    
                    // const id2 = "65f45d9f5489a9380ca9c849";
                    getTimeTrackedByEmployeeToday(ClockifyUserDataId, ClockifyWorkSpaceId).then((workTimeHours)=>{
                        if (totalTime !== workTimeHours) {
                           updateDocument({
                                collectionName: "userData",
                                id: id,
                                data: { workTimeHours: workTimeHours },
                            });
                            return hanldeChange(workTimeHours);
                        }
                      
    
                    });
                     
                }, 10000);
            }
            }
    } catch (error) {
        console.log("error", error.message);
    }
}
