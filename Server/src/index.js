const express = require("express");
const socket = require("socket.io");
const {getCurrentUser,addUser, userDisconnect} = require('./user');

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server, {
    cors: {
      origin: '*',
    }
  });  



io.on("connection", function (socket) {
  console.log("Made socket connection");
  
  //for a new user joining the room
    socket.on("joinChat", ({ username, roomname }) => {
    const newUser = addUser(socket.id, username,roomname);
    socket.join(newUser.room);
  
     //display a welcome message to the user who have joined a room
    socket.emit("message", {
        userId: newUser.id,
        username: newUser.username,
        text: `Welcome ${newUser.username}`,
      });
       //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(newUser.room).emit("message", {
        userId: newUser.id,
        username: newUser.username,
        text: `${newUser.username} has joined the chat`,
      });

   });

  
 // when user exits room
   socket.on("disconnect", function(data){
    const user = userDisconnect(socket.id);
    if(user){
        io.to(user.room).emit("message",{
            userId: user.id,
            username: user.username,
            text: `${user.username} has left the chat`,
        });
    }
   });

   // user sending message
   socket.on("chat", function(data){
       const currUser = getCurrentUser(socket.id);
       console.log(currUser);
       io.to(currUser.room).emit("message",{
        userId: currUser.id,
        username: currUser.username,
        text: data,
       });
   });

   // yet to implement
   socket.on("typing", function (data) {
    const currUser = getCurrentUser(socket.id);
    const msg = `${currUser.username} is typing`;
    socket.broadcast.emit("typing",  msg);
  });
 
  // file upload work in progress
  socket.on("fileUpload", function(data){
    const currUser = getCurrentUser(socket.id);
    socket.broadcast.to(currUser.room).emit("fileUploading", {
      userId: currUser.id,
      username: currUser.username,
      text: `${currUser.username} is uploading file`,
    });
  });
});

