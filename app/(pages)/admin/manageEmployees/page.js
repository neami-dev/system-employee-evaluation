"use client";
import { createEmployee } from "@/firebase/firebase-admin/createEmployee";
import { deleteEmployee } from "@/firebase/firebase-admin/deleteEmployee";
import { getEmployees } from "@/firebase/firebase-admin/getEmployees";
import getDocument from "@/firebase/firestore/getDocument";
import getDocuments from "@/firebase/firestore/getDocuments";
import React, { useEffect, useState } from "react";

export default function manageEmployees() {
    const [firestoreData, setFirestoreData] = useState([]);
    const [authData, setAuthData] = useState([]);
    // deleteEmployee("eubtvH7jfzMstBsSLNAdWGKr1k03")
    const getInfo = async () => {
        // const { employees } = await Promise.all([getEmployees()]);
        // const newUser = await createEmployee({
        //     email: "khalid2@gmail.com",
        //     emailVerified: true,
        //     password: "123456",
        // });
        const employees = await getEmployees();
        setAuthData(employees.result?.users);
        const newData = [];
        const res = await getDocuments("task");
        console.log(res);
        await Promise.all(
            employees.result?.users?.map(async (user) => {
                // console.log(user?.uid);
                // const res = await getDocument("userData", user?.uid);
                // console.log(res.error);
                // if (res.result !== null && res.result?.data() !== undefined) {
                //     console.log(res.result.id);
                //     // newData.push({ id: res.result.id, ...res.result?.data() });
                // }
            })
        );
        // console.log("newData", newData);
    };
    useEffect(() => {
        getInfo();
    }, []);

    // setFirestoreData(newData);

    return <div>manageEmployees</div>;
}
