import { Box, Grid} from "@chakra-ui/react";
import { useState } from "react";
import MyChats from "../components/MyChats";
import LeftHeader from "../components/LeftHeader";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/ChatProvider";
import AdminComponent from "./AdminComponent";
import AdminChatBox from "./AdminChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const [admin,selectAdmin]=useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <Grid templateColumns="30% 70%" gap={0} h="100%">
          <Box bg="transparent" backdropFilter="blur(30px)" p={4} h="100%">
            <LeftHeader />
            {user && (user.username === "admin") && <AdminComponent selectAdmin={selectAdmin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></AdminComponent>}

            {user && user.username !== "admin" && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

          </Box>
          <Box bg="transparent" backdropFilter="blur(30px)" p={0} h="100%">
            {user && user.username !== "admin" && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            {user && user.username === "admin" && <AdminChatBox admin={admin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          </Box>
        </Grid>
      )}
    </div>
    
  );
};

// checked

export default Chatpage;