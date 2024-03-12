"use client";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getDocument from "@/firebase/firestore/getDocument";
import { folders, getTasks, getuser, lists, spaces } from "@/app/api/actions/action";


export default function page() {
    const [userData, setUserData] = useState({});
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
        }
        const data = await getTasks();
        // console.log(data);
        await getuser();
        
       
    };

    // const getTasks = async ()=>{
    //     "use server"
    //     const listId = "901502971367";
    //     const resp = await fetch(
    //         `https://api.clickup.com/api/v2/list/${listId}/task?assignees[]=62621353`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 Authorization: auth,
    //             },
    //         }
    //     );

    //     const data = await resp.json();
    //     console.log("data",data);

    // }

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

    console.log(userData);
    return (
        <>
            <div className=" mt-10">
                <div>page</div>

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
            </div>
        </>
    );
}
