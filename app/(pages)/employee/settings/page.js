"use client";
import {
    getGitHubUsername,
    getTotalTest,
} from "@/app/api/actions/githubActions";

import { useEffect, useState } from "react";

export default function page() {
    const [test, setTest] = useState();
    const getData = async () => {
        const res = await fetch("https://fakestoreapi.com/products/1", {
         next:{revalidate: 1}   , // Revalidate every 6 seconds
        });

        setTest(res);
        console.log(res);

        // Optionally, you could choose to continue accumulating commits even if one repo fails, or handle differently
    };
    useEffect(() => {
        getData();
    }, []);
    console.log(test);
    return <div>page</div>;
}
