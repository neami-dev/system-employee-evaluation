"use client";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getDocument from "@/firebase/firestore/getDocument";
import { getFolders, getListsInSpace, getSpaces, getTasks, getTeams } from "@/app/api/clickupActions";

export default function page() {
    const [userData, setUserData] = useState({});
    const [data, setData] = useState({});
    const [res, setres] = useState({});

    const route = useRouter();
    const infoDoc = { collectionName: "userData", id: data?.uid };

    const logout = async () => {
        await signOut(auth);
    };
    // get info the user score department ...
    const getInfo = async () => {
        if (infoDoc.id !== undefined && infoDoc.collectionName !== undefined) {
            const result = await getDocument(
                infoDoc.collectionName,
                infoDoc.id
            );
            setUserData(result.result.data());
            const team = await getTeams()
            console.log("team : ",team);
            const spaces = await getSpaces(team[0].id)
            console.log("spaces : ",spaces);
            const folders = await getFolders(spaces[1].id)
            console.log("folders : ",folders);
            const list = await getListsInSpace(spaces[0].id)
            console.log("list : ",list);
            const task = await getTasks(list[0].id)
            console.log("task : ",task);
            }
    };

    // const testGetDocuments  = async ()=>{
    //     const result2 = await getDocuments("task");
    //     result2.result.docs.map((doc)=>{
    //         console.log(doc.data());
    //     })
    //  }
    // useEffect(()=>{
    //     testGetDocuments()
    // },[])
    useEffect(() => {
        // get info Auth
        auth.onAuthStateChanged((res) => {
            setData(res);
            if (data == null) {
                route.push("/auth/loginPage");
            }
        });
    }, [data]);

    useEffect(() => {
        getInfo();
    }, [infoDoc.id, infoDoc.collectionName]);

    console.log("userData:",userData);
    console.log("userData:",userData);
    return (
        <>
            <div>page</div>
            <Link className=" bg-lime-700" href="/auth/loginPage">
                login
            </Link>
            <button className=" bg-red-700" onClick={logout}>
                logout
            </button>
            <h4>{data?.email}</h4>
            <ul>
                <li>department {userData?.department}</li>
                <li>score {userData?.score}</li>
                <li>joiningDate {userData.joiningDate?.nanoseconds}</li>
                <ul>
                    skills{" "}
                    {userData?.skills?.map((skill, index) => {
                        return <li key={index}>{skill}</li>;
                    })}
                </ul>
            </ul>
        </>
    );
}
