import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "../components/Login";
import Signup from "../components/SignUp";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box
      d="flex"
      justifyContent="center"
      p={3}
      backdropFilter="blur(50px)" // Apply blur effect
      w="100%"
      m="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="0px 8px 16px rgba(0, 0, 0, 0.1)"
    >
      <Text fontSize="4xl" fontFamily="Send Flowers cursive">
        Chatting
      </Text>
    </Box>
      <Box 
      backdropFilter="blur(50px)"  w="100%" p={4} borderRadius="lg" borderWidth="1px" 
      boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
// checked