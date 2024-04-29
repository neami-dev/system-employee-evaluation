"use server"

import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_CHAT_SECRET;

export default async function generateToken(userId) {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    return serverClient.createToken(userId);
}

// Usage example
// const userId = '242445523';
// const token = generateToken(userId);
// console.log(token);