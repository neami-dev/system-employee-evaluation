"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import { redirect } from "next/navigation";
export default function Home() {
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState(0);
redirect("/employee/dashboard");
    const [users, setUsers] = useState([]);
    // const usersCollectionRef = collection(db, "users");

    const createUser = async () => {
        try {
            await addDoc(usersCollectionRef, {
                name: newName,
                age: Number(newAge),
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateUser = async (id, age) => {
        const userDoc = doc(db, "users", id);
        const newFields = { age: age + 1 };
        await updateDoc(userDoc, newFields);
    };

    const deleteUser = async (id) => {
        const userDoc = doc(db, "users", id);
        await deleteDoc(userDoc);
    };

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        getUsers();
    }, []);

    return (
        <div className="App">
            <input
                placeholder="Name..."
                onChange={(event) => {
                    setNewName(event.target.value);
                }}
            />
            <input
                type="number"
                placeholder="Age..."
                onChange={(event) => {
                    setNewAge(event.target.value);
                }}
            />

            <button onClick={createUser}> Create User</button>
            {users.map((user, i) => {
                return (
                    <div key={i}>
                        {" "}
                        <h1>Name: {user.name}</h1>
                        <h1>Age: {user.age}</h1> 
                        <button
                            onClick={() => {
                                updateUser(user.id, user.age);
                            }}
                        >
                            {" "}
                            Increase Age
                        </button>
                        <button
                            onClick={() => {
                                deleteUser(user.id);
                            }}
                        >
                            {" "}
                            Delete User
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
