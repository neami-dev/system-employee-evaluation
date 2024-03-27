import { getEmployees } from "@/firebase/firebase-admin/getEmployees";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const response = await getEmployees();
        
        return NextResponse.json({ ...response });
    } catch (err) {
        res.status(500).send({ error: "failed to fetch data" });
    }
}
