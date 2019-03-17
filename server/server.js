// import { title, body } from '../public/utils/blog';

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath))

/* io.emit works with every connection whereas 
 socket.emit works with single connections */

io.on('connection', (socket) => {
    console.log('New user connected!')

    socket.on('disconnect', () => {
        console.log('Disconnected from server!')
    });

    socket.on('createPost', (post) => {
        console.log('createPost: ', post)
        io.emit('newPost', post);
    });
});

server.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
    // console.log(body)
});