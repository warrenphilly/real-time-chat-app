//jshint esversion: 6

//initialize install dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

//reading dependencies
const app = express();
const server = http.createServer(app);
const io = socket_io(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName ="Warren's little helper";


io.on('connection', (socket) => {
    socket.on('joinRoom',({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // run when client connects
        socket.emit('message', formatMessage(botName, 'Welcome to the chat app'));

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined ${user.room}`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {

            room: user.room,
            users: getRoomUsers(user.room)
        })

    });
   
    //listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });

      //broadcats when user disconnects
      socket.on('disconnect',()=>{

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {

            room: user.room,
            users: getRoomUsers(user.room)
        })
        }
        
    })

});


//set port view engine
const PORT = process.env.PORT || 3000;
//listen to port
server.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});
