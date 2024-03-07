"use client";
import { db, usersCollectionRef } from "@/firebase/firebase-config";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
} from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function test() {
    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            console.log("data");
            console.log(
                data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        };

        getUsers();
    }, []);

    return <>k.hhhjh</>;
}
