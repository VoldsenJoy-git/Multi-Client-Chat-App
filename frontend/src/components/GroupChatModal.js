import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState, useCallback } from "react";
  import { ChatState } from "../context/ChatProvider";
  import UserBadgeItem from "./UserBadgeItem";
  import UserListItem from "./UserListItem";
import ChatLoading from "./ChatLoading";
  
  const GroupChatModal = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();

    console.log("Group chat admin",user)

    const GroupAdmin = user;
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
      console.log("userToadd",userToAdd)
    };
  
    const debounce = (func) => {
      let timer;
      return function (...args){
        const context=this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer=null
          func.apply(context, args);
        },500);
      }
    }
    const handleSearch = async(event) => {
      const {value} = event.target;
      try {
        setLoading(true);
  
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
  
        const { data } = await axios.get(`http://localhost:3001/api/users/search?search=${value}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    const optimisedVersion = useCallback(debounce(handleSearch),[]);
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.post(
          `http://localhost:3001/api/chats/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true, 
          position: "bottom",
        });
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent bg="transparent" boxShadow="0 0 20px 5px rgba(0, 0, 0, 0.4)">
            <ModalHeader
              fontSize="35px"
              fontFamily="Send Flowers cursive"
              d="flex"
              justifyContent="center"
              color="white"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  color="white"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  color="white"
                  onChange={optimisedVersion}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={user}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {false ? (
                <ChatLoading/>
                // <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((u) => (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleGroup(u)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;