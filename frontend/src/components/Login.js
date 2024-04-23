import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import EmailIcon from "@mui/icons-material/Email";
import { ChatState } from "../context/ChatProvider";

import './Login.css';
import { useToast } from '@chakra-ui/react';
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Progress } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/input";


import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { setUser } = ChatState();
    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle the state to show/hide password
    };

  const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "http://localhost:3001/api/users/login",
          { email, password },
          config
        );
  
        toast({ //Utilizes useToast for displaying success/error messages during login.
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        console.log("during login ",data)
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
  return (
      <VStack spacing="10px">
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
          onChange={(e) => {setEmail(e.target.value)}}
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
        Log In
      </Button>
    </VStack>
  )
}

export default Login 