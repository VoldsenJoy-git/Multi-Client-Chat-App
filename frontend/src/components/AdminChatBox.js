import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import React from "react";
import { FaPaperPlane } from "react-icons/fa"; // Import the paper plane icon from react-icons library

import { Center, Box, Text, Button, Flex } from "@chakra-ui/react";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react";
import animationData from "../components/animations/typing.json";
import "./styles.css";
import io from 'socket.io-client'
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { ChatState } from "../context/ChatProvider";
import { storage } from "../firebase";
import { InputGroup, InputRightElement } from "@chakra-ui/react";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";

const ENDPOINT = "http://localhost:3001"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const AdminChatBox = ({ admin, fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const initialFocusRef = React.useRef();

  const [imageUpload, setImageUpload] = useState(null);
  // const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            "http://localhost:3001/api/messages/adminsend",
            {
              content: null,
              imgurl: url,
            },
            config
          );
        //   io.emit("new message", data);
          setMessages([...messages, data]);
          console.log(messages);
          setFetchAgain(false);

        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      });
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {

    try {
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
    //   socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        setFetchAgain(true);
        console.log("send ", newMessage);
        const { data } = await axios.post(
          "http://localhost:3001/api/messages/adminsend",
          {
            content: newMessage,
            imgurl: null,
          },
          config
        );
        console.log("data",data)

        data.forEach((d) => {
        socket.emit("new message", d);
        });
        setMessages([...messages, data[0]]);
        console.log(messages);
        setFetchAgain(false);
      } catch (error) {
        console.log(error)
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io.connect(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

//   useEffect(() => {
//     fetchMessages();

//     selectedChatCompare = selectedChat;
//     // eslint-disable-next-line
//   }, [selectedChat]);

  useEffect(() => {
    console.log("useeffect working");
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    // if (!typing) {
    //   setTyping(true);
    // //   socket.emit("typing", selectedChat._id);
    // }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 3000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  return (
    <>
      {admin ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            p={3}
            m={0}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="#2F2F2F"
            // borderRadius="10px" // Adjust the border radius as needed
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
            </Box>
                <Text flex="1" textAlign="center" color="white">
                  BroadCast
                </Text>
              
            
          </Box>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            // bg="transparent"
            w="100%"
            borderRadius="lg"
            overflowY="hidden"
            

          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <InputGroup>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  color="white"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement width="auto">
                  <Popover
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Button>Send Image</Button>
                    </PopoverTrigger>
                    <PopoverContent
                      color="white"
                      bg="blue.800"
                      borderColor="blue.800"
                    >
                      <InputGroup>
                        <Input
                          type="file"
                          onChange={(event) => {
                            setImageUpload(event.target.files[0]);
                          }}
                          // style={{ display: "none" }} // Hide the file input
                        />
                      </InputGroup>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={uploadFile}
                    bg="gray.800"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                    _active={{ bg: "gray.900" }}
                    leftIcon={<FaPaperPlane />} // Use the paper plane icon as the left icon
                  ></Button>
                </InputRightElement>
              </InputGroup>
              ;
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Center h="100%">
          <Box textAlign="center" justifyContent={"center"}>
            <Text fontSize="2xl" pb={3} fontFamily="Send Flowers cursive" color="white">
              Click on a user to start chatting
            </Text>
          </Box>
        </Center>
      )}
    </>
  );
};

export default AdminChatBox;
