import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./Singlechat";
import { ChatState } from "../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={0}
      bg={selectedChat ? "url('https://wallpapercave.com/wp/hkBkZQg.jpg')" : "transparent"}
      backgroundSize="cover"
    backgroundPosition="center"
    w="100%"
    h="100%" // Adjust the height as needed
    overflowY="scroll"
    overflowX="hidden" // Prevent scrolling in the x-direction

    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
// checked