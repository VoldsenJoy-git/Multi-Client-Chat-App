import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import { getSender } from "../config/ChatLogics";
import ScrollableFeed from "react-scrollable-feed";
import AdminComponent from "./AdminComponent";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, setUser, chats, setChats } =
    ChatState();

    

  const toast = useToast();

  

  const fetchChats = async () => {
    try {
      console.log("fetchChats");
      console.log(user);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:3001/api/chats",
        config
      );
      console.log("data ", data);
      setChats(data);
      
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
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    console.log("logged user : ",user)
  }, [fetchAgain]);

  return (
    <Box overflowY="auto" maxHeight="calc(100vh - 150px)"> {/* Adjust maxHeight as needed */}
  {chats && chats.length > 0 ? (
    <VStack spacing={4} align="stretch" bg="transparent">
      {chats.map((chat) => (
        <Box
          key={chat._id}
          p={4}
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={() => setSelectedChat(chat)}
          borderRadius="md"
          borderWidth="1px"
          bg={
            selectedChat && selectedChat._id === chat._id
              ? "#8774E1"
              : "transparent"
          } // Background color conditional
          color="white" // Set the text color to white for all chats
          _hover={
            selectedChat && selectedChat._id !== chat._id
              ? { backgroundColor: "rgba(255, 255, 255, 0.2)" }
              : null
          } // Change background color on hover for non-selected chats
        >
          {/* Modify */}
          <Avatar
            name={
              !chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName
            }
          />

          {/* Chat details */}
          <VStack ml={4} align="flex-start">
            <Text>
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </Text>
            
            {chat.latestMessage && (
              <Text fontSize="xs">
                <b>
                  {chat.latestMessage.sender.username ==
                  user.username
                    ? "You :"
                    :  chat.isGroupChat && chat.latestMessage.sender.username}{" "}
                </b>
                {chat.isGroupChat }
                {chat.latestMessage.content==null ? (
                  " Sent a file"
                )
                 : 
                 (
                  chat.latestMessage.content.length > 50 ? (
                    <span>{" "}{chat.latestMessage.content.substring(0, 50)}...</span>
                  ) : (
                    <span>{" "}{chat.latestMessage.content}</span>
                  )
                )
                }
              </Text>
            )}
          </VStack>
        </Box>
      ))}
    </VStack>
  ) : null}
</Box>

  );
}

export default MyChats;
