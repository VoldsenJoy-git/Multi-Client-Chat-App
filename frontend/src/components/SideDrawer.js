import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, Button, Spinner } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
const debounce = require('lodash.debounce');



const SideDrawer = ({ isOpen, onClose, children }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const toast = useToast();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const {data} = await axios.post(`http://localhost:3001/api/chats`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
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

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search new Friends</DrawerHeader>
          <DrawerBody>
          <Box d="flex" pb={2}>
              <Input type={'text'} name={'search'} placeholder={'Enter username...'} onChange={optimisedVersion}></Input>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SideDrawer;
