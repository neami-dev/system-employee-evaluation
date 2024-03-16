"use client";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import getDocument from "@/firebase/firestore/getDocument";
import { getAuthenticatedUserDetails, getCompletedTasksByEmployee, getCompletedTasksByEmployeeToday, getFolders, getInProgressTasksByEmployee, getListsInSpace, getPendingTasksByEmployee, getSpaces, getTasks, getTeams } from "@/app/api/actions/clickupActions";
import { auth } from "@/firebase/firebase-config";
import NavBar from "@/components/component/NavBar";
import Menu from "@/components/component/menu";
import { Footer } from "react-day-picker";
import {
    Blocks,
    History,
    MessageSquareText,
    UserPlus,
    Users,
} from "lucide-react";

export default function page() {
    const [userData, setUserData] = useState();
    const [data, setData] = useState({});
    const [res, setres] = useState({});

    const route = useRouter();
    const infoDoc = { collectionName: "userData", id: data?.uid };

    // get info the user score department ...
    const getInfo = async () => {
        if (infoDoc.id !== undefined && infoDoc.collectionName !== undefined) {
            const result = await getDocument(
                infoDoc.collectionName,
                infoDoc.id
            );
            setUserData(result.result.data());
            console.log(result.result.data());
        }

        // const team = await getTeams();
        // console.log('team : ',team);

        //     const space = await getSpaces(team?.id);
        //     console.log('space : ',space);

        //     const folder = await getFolders(space[0]?.id);
        //     console.log('folder : ',folder);

        //     const list = await getListsInSpace(space[0]?.id);
        //     console.log('list : ',list);

        //     const task = await getTasks(list[0]?.id);
        //     console.log('task : ',task);

    // const userCickupDetails = await getAuthenticatedUserDetails();
    // console.log('userCickupDetails : ',userCickupDetails);

    // const tasksCompleted = await getCompletedTasksByEmployee(team.id,userCickupDetails.id);
    // console.log('tasksCompleted : ',tasksCompleted);

    // const tasksProgress = await getInProgressTasksByEmployee(team.id,userCickupDetails.id);
    // console.log('tasksProgress : ',tasksProgress);

    // const tasksPending = await getPendingTasksByEmployee(team.id,userCickupDetails.id);
    // console.log('tasksPending : ',tasksPending);
    };

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setData(user);
            } else {
                // Redirect if not authenticated
                route.push("/login");
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []); // Removed data from dependencies to avoid re-triggering

    useEffect(() => {
        if (infoDoc.id && infoDoc.collectionName) {
            getInfo();
        }
    }, [infoDoc.id, infoDoc.collectionName]);

    console.log("userData:", userData);
    return (
        <>
            

            {/* <div className=" mt-10">
               
                <div>page</div>
                <h4>{data?.email}</h4>
                <ul>
                    <li>department {userData?.department}</li>
                    <li>score {userData?.score}</li>
                    <li>joiningDate {userData?.joiningDate?.nanoseconds}</li>
                    <ul>
                        skills{" "}
                        {userData?.skills?.map((skill, index) => {
                            return <li key={index}>{skill}</li>;
                        })}
                    </ul>
                </ul>
            </div>  */}
        </>
    );
}
