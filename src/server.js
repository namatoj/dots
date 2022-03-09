const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db.sqlite');
const Action = require('./action.js')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/cross.png', (req, res) => {
    res.sendFile(__dirname + '/cross.png');
});

// const context = "bacc"

io.on('connection', (socket) => {
    socket.on('CLIENT_CONNECTED', (context) => {
        socket.join(context)
        sendActionLog(socket, context)
    })
    console.log('client connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('CLIENT_ACTION', (msg) => {
        console.log(msg)

        // Handle client action
        // TODO: Only emit msg to sockets of same context.
        io.sockets.in(msg.context).emit('CLIENT_ACTION', msg);
        let statement = db.prepare("INSERT INTO action_log VALUES (?, ?, ?);")
        statement.run(msg.context, msg.action, JSON.stringify(msg.params))
    });
});

const sendActionLog = (socket, context) => {
    console.log("in sendActionLog")
    db.each("SELECT context_id, action, payload FROM action_log WHERE context_id = ?", context, (err, row) => {
        msg = { 'action': row.action, 'params': JSON.parse(row.payload) }
        console.log("next msg:")
        console.log(msg)
        socket.emit('CLIENT_ACTION', msg)
    })
}

server.listen(3001, () => {
    console.log('listening on *:3001');

    db.run("CREATE TABLE IF NOT EXISTS action_log (context_id TEXT, action TEXT, payload TEXT)")
});
