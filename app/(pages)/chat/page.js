"use client"
// Import necessary React and Stream Chat components
import React, { useContext,useEffect, useState } from "react";
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
  Thread,
  ChannelListMessenger,
  ChannelPreviewMessenger,
  ChannelListContext,
  useChatContext,

} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css'; // Import custom CSS
import './layout.css'
import generateToken from "./stream-chat-client";
import CustomChannelPreview from "./customChannelPreview";

const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY);

function ChatComponent() {
    const route = useRouter();
    const [userData, setUserData] = useState({});
    const [channel, setChannel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // const channelListContext = useContext(ChannelListContext);

    // const { client, setActiveChannel } = useChatContext();

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

                setupDefaultChannel();
            };

            connectUser().catch(console.error);

            return () => chatClient.disconnectUser().catch(console.error);
        }
    }, [userData, isLoading]);

    // useEffect(() => {
    //     if (channelListContext) {
    //         console.log("Current channels in context:", channelListContext.channels);
    //     }
    // }, [channelListContext]);

    const CustomChannelPreview = ({ channel }) => {
        const { setActiveChannel } = useChatContext();
      
        const selectChannel = () => {
            console.log("heyy i'm ",channel);
            setActiveChannel(channel);
        };
        
        return (
            <div onClick={selectChannel} style={{ cursor: 'pointer' }}>
            {channel.data.name}
          </div>
        );
    };
      
    
    const setupDefaultChannel = async () => {
        const defaultChannel = chatClient.channel('messaging', 'newOne', {
            name: 'newOne',
            members: [userData.uid],
        });
        await defaultChannel.watch();
        setChannel(defaultChannel);
    };
    
    const handleChannelSelect = async (channel) => {
        console.log("heyy i'm ",channel);
        await channel.watch();
        setChannel(channel);
    };

    if (!channel) return <Loading />;

    return (
        <Chat client={chatClient} theme="messaging light">
            <ChannelList filters={{
                    type: 'messaging',
                    // members: { $in: [userData.uid] },
                    }} 
                    sort={{ last_message_at: -1 }} 
                    options={{
                    limit: 10,
                    }}
                    // List={ChannelListMessenger}
                    Preview={CustomChannelPreview}
                    // onSelect={() => handleChannelSelect}
                    
                    />
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
