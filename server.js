require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const Chat = require('./models/Chat');
const User = require('./models/User');
const app = express();
const server = http.createServer(app);
const {
    get_messages,
    send_message
} = require('./utils/messages');

var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: false,
        transports: ['websocket', 'polling'],
        allowEIO3: true
    },
});

//Database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connection established.'))
    .catch((error) => console.error("MongoDB connection failed:", error.message))
    // End Mongo Connection

// Run when client connects
io.on('connection', socket => {
    console.log("socket connection " + socket.id);
    socket.on('get_messages', function(object) {
        var user_room = "user_" + object.sender_id;
        socket.join(user_room);
        get_messages(object, function(response) {
            if (response.length > 0) {
                console.log("get_messages has been successfully executed...");
                io.to(user_room).emit('response', { object_type: "get_messages", data: response });
            } else {
                console.log("get_messages has been failed...");
                io.to(user_room).emit('error', { object_type: "get_messages", message: "There is some problem in get_messages..." });
            }
        });
    });
    // SEND MESSAGE EMIT
    socket.on('send_message', function(object) {
        var sender_room = "user_" + object.sender_id;
        var receiver_room = "user_" + object.receiver_id;
        send_message(object, function(response_obj) {
            if (response_obj) {
                console.log("send_message has been successfully executed...");
                io.to(sender_room).to(receiver_room).emit('response', { object_type: "get_message", data: response_obj });
            } else {
                console.log("send_message has been failed...");
                io.to(sender_room).to(receiver_room).emit('error', { object_type: "get_message", message: "There is some problem in get_message..." });
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async() => console.log(`Server running on port ${PORT}`));