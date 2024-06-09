"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export default function Profile() {
    const [currentComp, setCurrentComp] = useState("whoIam");
    const [userData, setUserData] = useState({});
    const [isLogged, setIsLogged] = useState(false);
    const route = useRouter();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDocument("userData", user?.uid).then((response) => {
                    response.result &&
                        setUserData({ ...response.result.data(), ...user });
                });
            }
        });
    }, []);

    const itemStyle =
        "cursor-pointer  relative text-center text-sm md:text-base hover:text-[#3354F4]   ";
    const JSXspan = (
        <span className="before:absolute before:w-full  before:h-[2px]  before:bg-[#3354F4] before:left-[-0px] md:before:top-[28px]  before:top-[24px]  "></span>
    );

    return (
        <>
            <section className="flex  justify-center min-[426px]:justify-end min-[426px]:px-5 min-[426px]:pr-8 flex-wrap mt-32 w-full">
                <div className="bg-white h-min w-full pb-7 min-[424px]:w-[86%] lg:w-[56%] rounded-lg ">
                    <h2 className="text-xl p-3 text-[#3354F4] ">About me</h2>
                    <ul className="flex justify-center md:justify-start md:pl-4 gap-x-4 text-[#828690]">
                        <li
                            onClick={() => setCurrentComp("whoIam")}
                            className={`md:w-[72px] ${
                                currentComp == "whoIam" && "text-[#3354F4]"
                            } ${itemStyle}`}
                        >
                            who i am
                            {currentComp == "whoIam" && JSXspan}
                        </li>

                        <li
                            onClick={() => setCurrentComp("skills")}
                            className={` md:w-[74px] ${
                                currentComp == "skills" && "text-[#3354F4]"
                            } ${itemStyle}`}
                        >
                            My skills
                            {currentComp == "skills" && JSXspan}
                        </li>
                    </ul>

                    <div className="pt-6">
                        {currentComp == "whoIam" && (
                            <WhoIam userData={userData} />
                        )}
                        {currentComp == "skills" && (
                            <Skills userData={userData} />
                        )}
                    </div>
                </div>
                <div className=" bg-white w-full pb-6 py-6 mt-5 min-[424px]:w-[86%] lg:w-[30%] lg:mx-4 lg:mt-0 xl:mx-8 rounded-lg   ">
                    <ul className="flex flex-col gap-2 items-center">
                        <li>
                            <Avatar className=" border-2 border-[#53abfe] w-[90px] h-[90px]">
                                <AvatarImage
                                    alt="User"
                                    src={userData?.photoURL}
                                />
                                <AvatarFallback className="capitalize font-bold text-3xl">
                                    {userData?.displayName?.split("")[0]}
                                    {/* {userData?.displayName?.split(" ")[1][0]} */}
                                </AvatarFallback>
                            </Avatar>
                        </li>
                        <li>
                            <h3 className="text-lg font-bold">
                                {userData?.displayName}
                            </h3>
                        </li>
                        <li className="text-[#828690] uppercase">
                            <h4>{userData?.department}</h4>
                        </li>
                    </ul>
                    <ul className="grid grid-cols-2 mt-5 mr-2 items-center p-1 ">
                        <li className="row-span-3 m-auto w-[80px]">
                            <CircularProgressbar
                                value={80}
                                text={`89`}
                                styles={buildStyles({
                                    pathTransition:
                                        "stroke-dashoffset 0.5s ease 0s",
                                    pathColor: "#3354F4",
                                })}
                            />
                        </li>
                        <li className="relative">
                            <span className="before:absolute before:w-[18px]  before:h-[18px] before:rounded-full  before:bg-[#6E29FF] before:left-[-24px]  before:top-[0px]   "></span>

                            <h3 className="text-[12px]">
                                Methodologie de travail
                            </h3>
                        </li>
                        <li className="relative">
                            <span className="before:absolute before:w-[18px]  before:h-[18px] before:rounded-full  before:bg-[#FC8E8E] before:left-[-24px]  before:top-[0px]   "></span>

                            <h3 className="text-[12px]">Attributs</h3>
                        </li>
                        <li className="relative">
                            <span className="before:absolute before:w-[18px]  before:h-[18px] before:rounded-full  before:bg-[#07D2FF] before:left-[-24px]  before:top-[0px]   "></span>

                            <h3 className="text-[12px]">
                                Apprentissage Continu
                            </h3>
                        </li>
                    </ul>
                    <ul className="flex flex-col items-center gap-3 mt-6 ">
                        <li className="flex justify-around items-center w-full">
                            <h3 className="font-bold">Last Activites</h3>
                            <Link href="/" className="text-[#3354F4]">
                                See all
                            </Link>
                        </li>
                        <li className=" border-2 rounded-lg m-2 ">
                            <p className="text-sm p-1 pl-8 relative">
                                <span className="before:absolute before:w-[22px]  before:h-[22px] before:rounded-full  before:bg-[#AEEDE2] before:left-[3px]  before:top-[2px]   "></span>
                                Your task has been accepted by the manager
                            </p>
                        </li>
                        <li className=" border-2 rounded-lg m-2">
                            <p className="text-sm p-1 pl-8 relative">
                                <span className="before:absolute before:w-[22px]  before:h-[22px] before:rounded-full  before:bg-[#FFC48E] before:left-[3px]  before:top-[2px]   "></span>
                                Your Application has accept 3 Companies
                            </p>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
}
function WhoIam({ userData }) {
    return (
        <div>
            <p className="text-sm p-3 text-[#797979] leading-7">
                {userData?.whoIAm}A wonderful serenity has taken possession of
                my entire soul, like these sweet mornings of spring which I
                enjoy with my whole heart. I am alone, and feel the charm of
                existence was created for the bliss of souls like mine.I am so
                happy, my dear friend
                
            </p>
            <ul className="flex justify-around flex-wrap gap-3 items-center">
                <li className="flex justify-center flex-col items-center w-40 bg-[#6E29FF] rounded-2xl h-40">
                    <span className="text-5xl text-white m-6">56%</span>
                    <h3 className="text-white text-xs">
                        Methodologie de travail
                    </h3>
                </li>
                <li className="flex justify-center flex-col items-center w-40 bg-[#FC8E8E] rounded-2xl h-40">
                    <span className="text-5xl text-white m-6">90%</span>
                    <h3 className="text-white text-xs">Attributs</h3>
                </li>
                <li className="flex justify-center flex-col items-center w-40 bg-[#07D2FF] rounded-2xl h-40">
                    <span className="text-5xl text-white m-6">40%</span>
                    <h3 className="text-white text-xs">
                        Apprentissage Continu
                    </h3>
                </li>
            </ul>
        </div>
    );
}

function Skills({ userData }) {
    return (
        <div>
            <ul className="flex gap-1 flex-wrap px-5">
                {userData?.skills !== undefined &&
                    userData?.skills.map((skill, index) => {
                        return (
                            <li key={index}>
                                <span className="bg-blue-100 text-[#3354F4] text-sm font-medium me-2 px-3 py-1 rounded ">
                                    {skill}
                                </span>
                            </li>
                        );
                    })}

                <li>
                    <span className="bg-blue-100 text-[#3354F4] text-sm font-medium me-2 px-3 py-1 rounded ">
                        Default
                    </span>
                </li>
                <li>
                    <span className="bg-blue-100 text-[#3354F4] text-sm font-medium me-2 px-3 py-1 rounded ">
                        Default
                    </span>
                </li>
                <li>
                    <span className="bg-blue-100 text-[#3354F4] text-sm font-medium me-2 px-3 py-1 rounded ">
                        Default
                    </span>
                </li>
            </ul>
        </div>
    );
}
