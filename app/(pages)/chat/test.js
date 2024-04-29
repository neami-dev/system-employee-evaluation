"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase-config";
import getDocument from "@/firebase/firestore/getDocument";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/component/Loading";
// import { ChatEngine } from "react-chat-engine";

// import { PrettyChatWindow } from "react-chat-engine-pretty";

import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';

const chatClient = StreamChat.getInstance(process.env.STREAM_CHAT_PRIVATE_KEY);

function ChatComponent() {
    const route = useRouter();
    const [userData, setUserData] = useState({});
    const [isLogged, setIsLogged] = useState(false)
    
    const [channel, setChannel] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if (user) {
                setIsLogged(true)
                getDocument("userData", user?.uid).then((response) => {
                    response.result &&
                        setUserData({ ...response.result.data(), ...user });
                });
            }else{
                route.push("/login");
            }
        });
    }, []);
    
    useEffect(() => {
        if (userData?.displayName && userData?.metadata?.createdAt) {
            setIsLoading(true)
        }
    }, [userData?.displayName,userData?.metadata?.createdAt])

    console.log( "userName=",userData?.displayName)
    console.log("userSecret=",userData?.metadata?.createdAt);
    
    // useEffect(() => {
    //     const connectUser = async () => {
    //       await chatClient.connectUser(
    //         { id: userData?.uid, name: userData?.displayName },
    //         chatClient.devToken(userData?.uid)
    //       );
    
    //       const channel = chatClient.channel('messaging', 'general', {
    //         name: 'General'
    //       });
    //       await channel.watch();
    //       setChannel(channel);
    //     };
    
    //     connectUser();
    
    //     return () => {
    //       chatClient.disconnectUser();
    //     };
    //   }, []);
    
    //   if (!channel) return <div>Loading chat...</div>;


	return (
        <>
        {isLoading ? 
            (
            <main>
                {/* <div className="h-[40px] bg-white p-[5px]">
                    <Button onClick={() => 
                        route.push("/employee/dashboard")}
                    className="bg-white hover:bg-gray-200 gap-1 text-black text-[17px] font-bold border border-5px border-black rounded" >
                        <img src="images/arrow_back_icon.png" className="w-[95%] h-[95%] " />
                        Back    
                    </Button>
                </div> */}
                <div className="">
                <Chat client={chatClient} >
                    <Channel >
                        <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                        </Window>
                    </Channel>
                </Chat>
                    {/* <PrettyChatWindow
                        // height="calc(100vh - 9vh)"
                        // width="calc(100vw)"
                        style={{ height: "100%" }}
                        projectId={'f88a2bb5-faec-41e1-a79a-5ff577f8d151'}
                        username={userData?.displayName}
                        secret={userData?.metadata?.createdAt}
                    /> */}
            </div>
            </main>
            ) : (
            <Loading />
        )
        }
		
        </>
	);
}

export default ChatComponent;