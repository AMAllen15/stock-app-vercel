const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const rooms = {};
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Assuming your React app is served from this URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a room
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`New user joined room: ${room}`);
  });

  // // Send message to a specific room
  // socket.on("sendMessage", ({ room, name, message }) => {
  //   io.to(room).emit("receiveMessage", { name, message });
  // });

  // Edit message event
  socket.on("editMessage", (updatedMessage) => {
    io.to(updatedMessage.room).emit("messageEdited", updatedMessage);
  });

  // Delete message event
  socket.on("deleteMessage", (messageId) => {
    io.emit("messageDeleted", messageId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on("createRoom", (roomName) => {
    console.log(`Room created: ${roomName}`);
    rooms[roomName] = { name: roomName, messages: [] };
    socket.join(roomName);
    io.emit("roomList", Object.keys(rooms)); // Update room list for all clients
  });

  socket.on("deleteRoom", (roomName) => {
    delete rooms[roomName];
    io.emit("roomList", Object.keys(rooms)); // Update room list for all clients
  });

  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
  });

  socket.on("sendMessage", ({ room, name, message }) => {
    if (rooms[room]) {
      // Ensure room exists
      const msg = { name, message, id: Date.now() };
      rooms[room].messages.push(msg);
      io.to(room).emit("receiveMessage", msg);
    }
  });
});

const debug = require("debug")("socket.io");
debug.enabled = true; // Enable verbose logging

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
