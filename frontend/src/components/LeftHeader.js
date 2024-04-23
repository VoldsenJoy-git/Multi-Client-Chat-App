import { useState } from 'react';
import { Box, IconButton, Input, InputGroup, InputRightElement, Flex, Button, Icon, Grid } from "@chakra-ui/react";
import { FaBars, FaSearch, FaUser, AddIcon } from "react-icons/fa";
import { BellIcon, HamburgerIcon, SmallAddIcon } from "@chakra-ui/icons";
import MailIcon from '@mui/icons-material/Mail';

import SideDrawer from "../components/SideDrawer";
import GroupChatModal from "../components/GroupChatModal";

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
  
function LeftHeader() {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const handleSearchDrawerOpen = () => {
    setIsSearchDrawerOpen(true);
  };

  const navigate=useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }
  
    return (
        <>
        <Flex alignItems="center" mb={8}>
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<HamburgerIcon />}
                variant='outline'
                color="white" // Set the color to white
                marginRight={4} 
            />
            
            <MenuList>
                <MenuItem >
                  <GroupChatModal>
                    <Button
                      d="flex"
                      fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                      rightIcon={<SmallAddIcon />}
                    >
                      New Group Chat
                    </Button>
                  </GroupChatModal>
                </MenuItem>
                <MenuItem >
                    sample2
                </MenuItem>
                <MenuItem >
                    sample3
                </MenuItem>
                
            </MenuList>
        </Menu>
      <Box onClick={handleSearchDrawerOpen} cursor="pointer" >
        <InputGroup mr={4}> 
          <Input placeholder="Search" />
          <InputRightElement>
            <IconButton 
              aria-label="Search"
              icon={<FaSearch />}
              onClick={handleSearchDrawerOpen}
              padding={3}
              display={{ base: 'none', md: 'block' }}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Menu>
        <MenuButton
            as={IconButton}
            aria-label="Profile"
            icon={<Icon as={FaUser} />}
            margin={4}
            display={{ base: 'none', md: 'block' }}
        />
        <MenuList direction="ltr" p>
            <MenuGroup title='Profile'>
              <ProfileModal user={user}><MenuItem>My Account</MenuItem></ProfileModal>
            
            <MenuItem as="button" onClick={handleLogout}>Log out</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Help'>
            <MenuItem>Docs</MenuItem>
            <MenuItem>FAQ</MenuItem>
            </MenuGroup>
        </MenuList >
        
        </Menu>
        {/* <Menu><MenuButton> <BellIcon color={'whitesmoke'} fontSize={'2xl'} m={4} display={{ base: 'none', md: 'block' }}></BellIcon></MenuButton></Menu> */}
        {/* <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<MailIcon />}
                variant='outline'
                color="white" // Set the color to white
                marginRight={4} 
            />
            
            <MenuList pl={2} >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                zIndex={3}
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
        </Menu>
      <SideDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
      >
      </SideDrawer>
    </Flex>
    
  </>
      
    )
  }

  export default LeftHeader;