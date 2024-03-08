
import { STATUS_PROJECT_TASK } from "@/app/utils/constant";
import addDocument from "@/firebase/firestore/addDocument";

export default async function page() {
  
    const data = {
        taskName: "taskName1",
        assignedTo: "idEmployee100",
        description: "description",
        startDate: new Date(),
        andDate: new Date(),
        expectedEndDate: new Date(),
        status: STATUS_PROJECT_TASK.ON_HOLD,
    };
    const collectionName =  "task";
      
    const result = await addDocument(collectionName, data);
    console.log("result", result.result.id);
    console.log("error", result.error);

    return <>task page</>;
}
