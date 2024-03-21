"use client";
import ChangingProgressProvider from "@/components/component/ChangingProgressProvider";
import Link from "next/link";
import React, { useState } from "react";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";

export default function Profile() {
    const [currentComp, setCurrentComp] = useState("whoIam");
    const itemStyle =
        "cursor-pointer  relative    text-center   text-sm md:text-base hover:text-[#3354F4]   ";
    const JSXspan = (
        <span className="before:absolute before:w-full  before:h-[2px]  before:bg-[#3354F4] before:left-[-0px] md:before:top-[28px]  before:top-[24px]  "></span>
    );
    return (
        <>
            <section>
                <div className="bg-white w-full mt-32 min-[424px]:w-[86%] text min-[424px]:ml-[52px] lg:ml-[26px]  lg:w-[56%] lg:p-2  rounded-lg ">
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

                        <li
                            onClick={() => setCurrentComp("sastProjects")}
                            className={` md:w-[105px] ${
                                currentComp == "sastProjects" &&
                                "text-[#3354F4]"
                            } ${itemStyle}`}
                        >
                            Last projects
                            {currentComp == "sastProjects" && JSXspan}
                            {}
                            {/* <span className="before:absolute before:w-28  before:h-[6px]  before:bg-[#3354F4] before:left-[-4px]  before:top-[28px]  "></span> */}
                        </li>
                    </ul>

                    <div className="pt-6">
                        {currentComp == "whoIam" && <WhoIam />}
                        {currentComp == "skills" && <Skills />}
                        {currentComp == "sastProjects" && <LastProjects />}
                    </div>
                </div>
                <div className=" bg-white rounded-lg w-full h-[600px] py-6 mt-9">
                    <ul className="flex flex-col gap-2 items-center">
                        <li>
                            <img
                                className=" rounded-full border-2 border-[#53abfe] w-[90px] h-[90px]"
                                alt="User"
                                src="https://github.com/shadcn.png"
                            />
                        </li>
                        <li>
                            <h3 className="text-lg font-bold">
                                Ahmed Herington
                            </h3>
                        </li>
                        <li className="text-[#828690]">
                            <h4>UI/UX DESIGNER</h4>
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
function WhoIam() {
    return (
        <div>
            <p className="text-sm p-3 text-[#797979] leading-7">
                A wonderful serenity has taken possession of my entire soul,
                like these sweet mornings of spring which I enjoy with my whole
                heart. I am alone, and feel the charm of existence was created
                for the bliss of souls like mine.I am so happy, my dear friend,
                so absorbed in the exquisite sense of mere tranquil existence,
                that I neglect my talents. A collection of textile samples lay
                spread out on the table - Samsa was a travelling salesman - and
                above it there hung a picture that he had recently cut out of an
                illustrated magazine and housed in a nice, gilded frame.
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

function Skills() {
    return (
        <div>
            <h2>My skills</h2>
            <ul>
                <li>skills one</li>
                <li>skills two </li>
                <li>skills three</li>
                <li>skills four</li>
            </ul>
        </div>
    );
}

function LastProjects() {
    return (
        <div>
            <h2>Last projects</h2>
        </div>
    );
}
