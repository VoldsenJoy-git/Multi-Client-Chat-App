import { Box, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import axios from "axios";

import { ChatState } from '../context/ChatProvider';

function AdminComponent({selectAdmin}) {
    const { selectedChat, setSelectedChat, user, setUser, chats, setChats } =
    ChatState();
    const [messages, setMessages] = useState([]);
    const toast = useToast();
    const adminHandler = async() => {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
        
              const { data } = await axios.get(
                "http://localhost:3001/api/chats/adminchat",
                config
              );
              console.log("data ", data);
        } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to Load the chats",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
        try {
            console.log("admin handler");
            console.log(user);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await axios.get(
              "http://localhost:3001/api/messages/admin",
              config
            );
            console.log("data ", data);
            setMessages([...messages, data]);
            selectAdmin(true);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to Load the chats",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
    }
    
  return (
    <Box
          p={4}
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={adminHandler}
          borderRadius="md"
          borderWidth="1px"
          bg={
               "transparent"
          } // Background color conditional
          color="white" // Set the text color to white for all chats
        >BroadCast Message</Box>
  )
}

export default AdminComponent