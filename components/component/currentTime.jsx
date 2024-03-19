"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const CurrentTime = ({ initialTime }) => {
    const [currentTime, setCurrentTime] = useState(initialTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return currentTime ? (
        currentTime
    ) : (
        <Skeleton className="h-3 w-[110px] my-1" />
    );
};

CurrentTime.getInitialProps = async () => {
    return { initialTime: new Date().toLocaleTimeString() };
};

export default CurrentTime;
