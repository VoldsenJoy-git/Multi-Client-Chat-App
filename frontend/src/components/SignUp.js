import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import EmailIcon from "@mui/icons-material/Email";
import "./SignUp.css";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/input";
import { Progress, Text } from '@chakra-ui/react'
import { VStack } from "@chakra-ui/layout";
import { useToast } from '@chakra-ui/react';
import { Button } from "@chakra-ui/button";
import { Box } from '@chakra-ui/react'
import { MotionBox } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { ChatState } from "../context/ChatProvider";


import axios from 'axios';



const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate=useNavigate();
  const { setUser } = ChatState();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle the state to show/hide password
    };
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/api/users/signup", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
      
      if (response.status === 200) {
        toast({
          title: "SignUp successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position:"bottom-left",
        });
        setLoading(false);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        navigate("/chats");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      console.log("Full error object:", error);
      toast({
        title: "SignUp failed",
        status: "error", 
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
        description: "An error occurred while signing up",
      });
      setLoading(false);
    }
  };
  return (
      <VStack spacing="10px">
      <FormControl id="firstname" isRequired>
        <FormLabel>Firstname</FormLabel>
        <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<FaUser fontSize="small" color="gray.300" />}
        />
        <Input
        className="input-box"
          type="text"
          placeholder='Enter Firstname'
          _placeholder={{ color: 'inherit' }}
          color='teal.700'
          variant="filled" 
          bg="gray.100" 
          focusBorderColor="#00A67D"
          _focus={{
            color: "teal.900", // Change color when focused
            bgColor: "gray.100"
          }}
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
        /></InputGroup>
      </FormControl>
      <FormControl id="lastname" isRequired>
        <FormLabel>Lastname</FormLabel>
        <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<FaUser fontSize="small" color="gray.300" />}
        />
        <Input
        className="input-box"
          type="text"
          placeholder='Enter Lastname'
          _placeholder={{ color: 'inherit' }}
          color='teal.700'
          variant="filled" 
          bg="gray.100" 
          focusBorderColor="#00A67D"
          _focus={{
            color: "teal.900", // Change color when focused
            bgColor: "gray.100"
          }}
          onChange={(e) => {
            setLastname(e.target.value);
          }}
        /></InputGroup>
      </FormControl>
      <FormControl id="username" isRequired>
        <FormLabel>Username</FormLabel>
        <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<FaUser fontSize="small" color="gray.300" />}
        />
        <Input
        className="input-box"
          type="text"
          placeholder='Enter Your Username'
          _placeholder={{ color: 'inherit' }}
          color='teal.700'
          variant="filled" 
          bg="gray.100" 
          focusBorderColor="#00A67D"
          _focus={{
            color: "teal.900", // Change color when focused
            bgColor: "gray.100"
          }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        /></InputGroup>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<EmailIcon fontSize="small" color="gray.300" />}
        />
        <Input
        className="input-box"
          type="email"
          placeholder='Enter Your Email Address'
          _placeholder={{ color: 'inherit' }}
          color='teal.700'
          variant="filled" 
          bg="gray.100" 
          focusBorderColor="#00A67D"
          _focus={{
            color: "teal.900", // Change color when focused
            bgColor: "gray.100"
          }}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        </InputGroup>
        
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<FaLock fontSize="small" color="gray.300" />}
        />
        <Input
          className="input-box"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          _placeholder={{ color: 'inherit' }}
          color='teal.700'
          variant="filled" 
          bg="gray.100" 
          focusBorderColor="#00A67D"
          _focus={{
            color: "teal.900", // Change color when focused
            bgColor: "gray.100"
          }}
          onChange={(e) => {
            setPassword(e.target.value)
            setProgress(100);
          }}
        />
        <InputRightElement width="4.5rem">
      <Box as="button" h="1.75rem" size="sm" onClick={handleTogglePassword}>
        {showPassword ? <FaEyeSlash color="gray.500" /> : <FaEye color="gray.500" />}
      </Box>
    </InputRightElement>
        </InputGroup>
        
      </FormControl>
      
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
        className="animatedButton"
      >
  <Text className="buttonText">Sign Up</Text>
      </Button>
    </VStack>
  );
};

export default SignUp;
