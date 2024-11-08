const express = require("express");
const { Server } = require("socket.io");
const { userJoin, getUsersInRoom, userLeave } = require("./utils/users"); // Import user utilities
const app = express();

const server = require("http").createServer(app);
const io = new Server(server);

// Sample user list
let users = [];

// Utility function to add user
function addUser({ name, userId, roomId, host, presenter, socketId }) {
    const user = { name, userId, roomId, host, presenter, socketId };

    // Check if the user already exists
    const existingUser = users.find((u) => u.userId === userId && u.roomId === roomId);

    if (!existingUser) {
        users.push(user);
    }

    // Return all users in the current room
    return users.filter((u) => u.roomId === roomId);
}

// Utility function to remove user
function removeUser(socketId) {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0]; // Remove the user and return it
    }
}

// Utility function to get user by socket ID
function getUser(socketId) {
    return users.find((user) => user.socketId === socketId);
}

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;
        socket.join(roomId);

        // Notify user and others about joining
        const usersInRoom = addUser({
            name,
            userId,
            roomId,
            host,
            presenter,
            socketId: socket.id,
        });
        socket.emit("userIsJoined", { success: true, users: usersInRoom });
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
        socket.broadcast.to(roomId).emit("allUsers", usersInRoom);

        // Send any existing whiteboard data (if any)
        if (imgURLGlobal) {
            socket.emit("whiteBoardDataResponse", {
                imgURL: imgURLGlobal,
            });
        }
    });

    socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id); // Find the user by their socket ID
    if (user) {
        console.log("Received message:", message, "from", user.name); // Debugging
        socket.broadcast.to(user.roomId).emit("messageResponse", {
            message,
            name: user.name, // The name of the sender
        });
        console.log("Broadcasting message to room", user.roomId);
    }
});
    // Listen for incoming canvas/whiteboard data
    socket.on("whiteboardData", (data) => {
        imgURLGlobal = data;  // Save the global whiteboard data (as an image URL)
        
        // Broadcast the updated canvas data to everyone else in the same room
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.roomId).emit("whiteBoardDataResponse", {
                imgURL: data,
            });
        }
    });

    socket.on("disconnect", () => {
        const user = getUser(socket.id);
        if (user) {
            removeUser(socket.id);
            socket.broadcast.to(user.roomId).emit("userLeftMessageBroadcasted", user.name);
        }
    });
});


const port = process.env.PORT || 5000;
server.listen(port, () =>
    console.log("Server is running on http://localhost:5000")
);
