"use client";
import { STATUS_PROJECT_TASK } from "@/app/utils/constant";
import addDocument from "@/firebase/firestore/addDocument";
import { Timestamp } from "firebase/firestore";

export default async function page() {
    const data = {
        projectName: "projectName10",
        description: "description",
        startDate: Timestamp.fromDate(new Date("December 10, 2020")),
        andDate: Timestamp.fromDate(new Date()),
        status: STATUS_PROJECT_TASK.COMPLETED,
    };
    const collectionName = "project";

    const result = await addDocument(collectionName, data);
    console.log("result", result.result);
    console.log("error", result.error);

    return <>project page</>;
}
