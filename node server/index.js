//  Node Server which will handle socket IO connections
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const io = require('socket.io')(8000)
import express from "express";
import cors from "cors";
const app = express();


const users = {};
app.use(cors({
    origin: "*",
}));

io.on('connection', socket =>{
    socket.on('new-user-joined', names =>{
        console.log("New user", names);
        users[socket.id] = names;
        socket.broadcast.emit('user-joined', names);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

