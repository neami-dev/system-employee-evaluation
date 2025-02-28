"use client"
// Import necessary React and Stream Chat components
import React, { useContext,useEffect, useMemo, useState } from "react";
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
  useTranslationContext,

} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css'; // Import custom CSS
import './layout.css'
import generateToken from "./stream-chat-client";
import "./CustomChannelPreview.css";

const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY);

function ChatComponent() {
    const route = useRouter();
    const [userData, setUserData] = useState({});
    const [channel, setChannel] = useState(null);
 

    // const channelListContext = useContext(ChannelListContext);

    // const { client, setActiveChannel } = useChatContext();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const doc = await getDocument("userData", user.uid);
                if (doc.result) {
                    setUserData({...doc.result.data(), ...user});
                    
                    console.log("uid : ", user.uid);
                }
            }  
        });
    }, [auth, route]);

    useEffect(() => {
        if (userData.uid) {
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
    }, [userData]);

    const CustomChannelPreview = (props) => {
        const {
          channel,
          activeChannel,
          displayImage,
          displayTitle,
          latestMessage,
          setActiveChannel,
        } = props;
        const latestMessageAt = channel.state.last_message_at;
        const isSelected = channel.id === activeChannel?.id;
        const { userLanguage } = useTranslationContext();
      
        const timestamp = useMemo(() => {
          if (!latestMessageAt) {
            return '';
          }
          const formatter = new Intl.DateTimeFormat(userLanguage, {
            timeStyle: 'short',
          });
          return formatter.format(latestMessageAt);
        }, [latestMessageAt, userLanguage]);
        // const { setActiveChannel } = useChatContext();
      
        const selectChannel = async () => {
            console.log("heyy i'm ",channel);
            await channel.watch();
            setChannel(channel);
            setActiveChannel(channel);
        };
        
        return (
            // <div onClick={selectChannel} style={{ cursor: 'pointer' }}>
            //     {channel.data.name}
            // </div>

            <button
            className={`channel-preview ${isSelected ? 'channel-preview_selected' : ''}`}
            disabled={isSelected}
            onClick={selectChannel}
            >
            {/* <img className='channel-preview__avatar' src={displayImage} alt='' /> */}
            <div className='channel-preview__main'>
            <div className='channel-preview__header'>
                {displayTitle}
                <time dateTime={latestMessageAt?.toISOString()} className='channel-preview__timestamp'>
                {timestamp}
                </time>
            </div>
            <div className='channel-preview__message'>{latestMessage}</div>
            </div>
            </button>

        );
    };
    // useEffect(() => {
    //     if (channelListContext) {
    //         console.log("Current channels in context:", channelListContext.channels);
    //     }
    // }, [channelListContext]);

    

      
    
    const setupDefaultChannel = async () => {
        const defaultChannel = chatClient.channel('messaging', 'ChatGroup', {
            name: 'ChatGroup',
            members: [],
        });
        await defaultChannel.watch();
        setChannel(defaultChannel);
    };

    if (!channel) return <Loading />;

    return (
        <Chat client={chatClient}  theme="messaging light">
            <div className="absolute top-7 right-5 bg-blue-500 w-[60px] h-[40px] z-50  font-bold text-white rounded-lg
                hover:cursor-pointer flex justify-center items-center " onClick={() => route.push("/employee/dashboard")}>Home</div>
            <div className="channel-list__container">
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
                        // showChannelSearch
                        // additionalChannelSearchProps={{ searchForChannels: true }}
                        />
                </div>
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
