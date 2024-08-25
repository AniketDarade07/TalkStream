const express = require('express');
const process = require('process');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded"); // Keep event names consistent
    });

    socket.on("callUser", (data) => {
        console.log("Forwarding callUser event:", data);
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name
        });
    });

    socket.on("answerCall", (data) => {
        console.log("Forwarding answerCall event:", data);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); 
});


// Start the server
server.listen(5000, () => console.log(`Server is running on port 5000`));

