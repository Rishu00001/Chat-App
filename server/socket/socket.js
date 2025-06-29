import http from "http";
import express from "express";
import { Server } from "socket.io";
import User from "../models/user.model.js";
import { log } from "console";

let app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `https://wechat-22ij.onrender.com`, // Update if frontend URL changes
    credentials : true,
  },
});

export const userSocketMap = {};
export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
    // userId : socketId
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Typing Event Handler
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      console.log("typing started");

      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });
  socket.on("stop-typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", { senderId: userId });
    }
  });

  socket.on("disconnect", async () => {
    if (userId) {
      try {
        const now = new Date();
        await User.findByIdAndUpdate(userId, {
          lastseen: now,
        });
        io.emit("userLastSeenUpdated", { userId, lastseen: now });
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // ✅ fixed this line
      } catch (error) {
        console.error("Error updating lastSeen:", error);
      }
    }
  });
});

export { app, server, io };
