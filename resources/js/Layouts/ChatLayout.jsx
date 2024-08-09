import { usePage } from "@inertiajs/react";
import { React, useEffect, useState } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import echo from "../echo";
export default function ChatLayout({ children }) {
    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations,setLocalConversations] = useState([]);
    const [sortedConversations,setSortedConversations ] = useState([])
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversation;
    const selectedConversation = page.props.selectedConversation;
    const isUserOnline = (userId)=>onlineUsers[userId];
    console.log("conversation", conversations);
    console.log("selected conversation", selectedConversation);

    useEffect(()=>{
        setSortedConversations(
            localConversations.sort((a,b)=>{
                if(a.block_at &&b.block_at){
                    return a.block_at > b.block_at ? 1:-1
                }
                else if(a.block_at){
                    return 1;
                }
                else if(b.block_at){
                    return -1;
                }
                if(a.last_message_date && b.last_message_date){
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    )
                }
                else if(a.last_message_date){
                    return -1;
                }
                else if(b.last_message_date){
                    return 1;

                }
                else{
                    return 0
                }
            })
        )
    },[])

    useEffect(() => {
        echo.join("online")
            .here((users) => {
                console.log("here", users);
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((prevUsers)=>{
                    return {...prevUsers,...onlineUsersObj};
                })
            })
            .joining((user) => {
                console.log("join", user);
                setOnlineUsers((prevUsers) => {
                    const updatedUsers = { ...prevUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                console.log("leave", user);
                setOnlineUsers((preUsers) => {
                    const updateUser = { ...preUsers };
                    delete updateUser[user.id];
                    return updateUser;
                });
            })
            .error((e) => console.log(e));
        return () => {
            echo.leave("online");
        };
    }, []);
    return <>Chat Layout</>;
}
