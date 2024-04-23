const asyncHandler = require("express-async-handler");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");
/*In the context of Mongoose and MongoDB, the term "populates" refers
 to a feature that allows you to automatically replace specified paths
in a document with documents from other collections */

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  console.log("all messages", req)
  try {
    //send all messages corresponding to that chat-id
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const adminMessages = asyncHandler(async (req, res) => {
  console.log("admin msgs",req)
  try {
    //send all messages corresponding to admin id
    const messages = await Message.find({ sender: req.user._id })

      .populate("sender", "username email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, imgurl, chatId } = req.body;

  if ((!content && !imgurl) || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    imageUrl: imgurl,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessageAdmin = asyncHandler(async (req, res) => {
  const { content, imgurl } = req.body;

  if ((!content && !imgurl)) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  
  
  try {
      // Find all chats where the current user is a participant
      const chats = await Chat.find({ users: req.user._id });
  
      // Iterate through each chat
      const messages = [];

for (const chat of chats) {
  // Create a new message for each chat
  // console.log("chat ", chat);
  var newMessage = {
    sender: req.user._id,
    content: content,
    imageUrl: imgurl,
    chat: chat._id,
  };
  var message = await Message.create(newMessage);

  // Populate sender, chat, and users
  message = await message.populate("sender", "username");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "username email",
  });

  // Update latestMessage of the chat
  await Chat.findByIdAndUpdate(chat._id, { latestMessage: message });

  messages.push(message); // Store the populated message in the array
}

res.status(200).json(messages);
  } catch (error) {
    console.error("Error occurred:", error); // Log the error message

      res.status(400).send(error.message);
  }
});

module.exports = { allMessages, sendMessage, adminMessages, sendMessageAdmin };