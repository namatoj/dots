const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/cross.png', (req, res) => {
    res.sendFile(__dirname + '/cross.png');
});

io.on('connection', (socket) => {
    console.log('client connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('CLIENT_ACTION', (msg) => {
        // Handle client action
        io.emit('CLIENT_ACTION', msg);
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});
