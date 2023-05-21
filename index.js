const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const CONNECTDB = require("./DataBase/connect");
const MessageRoute = require("./Routers/Message");
const ConversationRoute = require("./Routers/Conversation");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
const app = express();
const http = require("http").Server(app);
const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('combined'));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({origin:"*"}));


const io = new Server(http,{ 
    cors: {
      origin: "http://localhost:3000"
  }
  });

  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connect
    console.log(`⚡: ${socket.id} user just connected!`);
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });


app.use("/api/message",MessageRoute);
app.use("/api/conversation",ConversationRoute);


//database connection
CONNECTDB(process.env.MONGO_DB_URL);

//listening to port 5000
http.listen(PORT,()=>{
    console.log(`server is listening to port ${PORT}`);
})