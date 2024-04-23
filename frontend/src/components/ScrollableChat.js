import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import Message from "./Message";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <ScrollableFeed style={{ flex: 1, overflowY: "auto" }}>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.username}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.username}
                  />
                </Tooltip>
              )}
              {/* <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.imageUrl ? (
                <img src={m.imageUrl} alt="Image" />
              ) : (
                <p>{m.content}</p>
              )}
            </span> */}
              <Message
                message={m}
                userId={user._id}
                isSameSenderMargin={isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user._id
                )}
                isSameUser={isSameUser(messages, m, i, user._id)}
              />
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
