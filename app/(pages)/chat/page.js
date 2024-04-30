"use client"
// Import necessary React and Stream Chat components
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/component/Loading";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css'; // Import custom CSS
import './layout.css'
import generateToken from "./stream-chat-client";

const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY);

function ChatComponent() {
    const route = useRouter();
    const [userData, setUserData] = useState({});
    const [channel, setChannel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const doc = await getDocument("userData", user.uid);
                if (doc.result) {
                    setUserData({...doc.result.data(), ...user});
                    setIsLoading(true);
                    console.log("uid : ", user.uid);
                }
            } else {
                route.push("/login");
            }
        });
    }, [auth, route]);

    useEffect(() => {
        if (userData.uid && isLoading) {
            const connectUser = async () => {
                const token = await generateToken(userData.uid);
                console.log('chat token : ',token);
                await chatClient.connectUser(
                    { id: userData.uid, name: userData.displayName || "Anonymous" },
                    token
                );

                const channel = chatClient.channel('messaging', 'newOne', {
                    name: 'newOne',
                    members: [userData.uid],
                });
                await channel.watch();
                setChannel(channel);
            };

            connectUser().catch(console.error);

            return () => chatClient.disconnectUser().catch(console.error);
        }
    }, [userData, isLoading]);

    if (!channel) return <Loading />;

    return (
        <Chat client={chatClient} theme="messaging light">
            <ChannelList filters={{
                    type: 'messaging',
                    members: { $in: [userData.uid] },
                    }} 
                    sort={{ last_message_at: -1 }} 
                    options={{
                    limit: 10,
                    }} />
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                    <Thread />
                </Window>
            </Channel>
        </Chat>
    );
}

export default ChatComponent;
