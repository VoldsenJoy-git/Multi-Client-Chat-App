const express = require("express")
const cors = require ("cors");
const connectDB  = require ("./DB/db.js");
const bodyParser = require ("body-parser");
const helmet = require ("helmet");
const morgan = require ("morgan");
const userRouter = require ("./Routers/userRouter.js");
const chatRouter = require("./Routers/chatRouter.js");
const messageRouter = require("./Routers/messageRouter");
const { notFound, errorHandler } = require("./errorMiddleware");


const app = express();

connectDB();
 
 

// Middleware
app.use(express.json());
app.use(
  cors({// Enables Cross-Origin Resource Sharing (CORS) for allowing requests from different origins.
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

require('dotenv').config(); // Load environment variables from .env file

const port = process.env.PORT || 3002;

// Router
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
const io = require("socket.io")(server, {
  pingTimeout: 60000000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");
    const isBroadcast = chat.users.some(user => user.username === "admin");
    if (isBroadcast) {
      console.log("broadcasting");
      io.emit("message recieved", newMessageRecieved);
    }
    else{
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    }
    
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});