import http from "http";
import express from "express";
import { Server } from "socket.io";
import User from "../models/user.model.js";
let app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `https://wechat-22ij.onrender.com`,         //
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
    //userId : socketId
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", async () => {
    if (userId) {
      try {
        const now = new Date();
        await User.findByIdAndUpdate(userId, {
          lastseen: new Date(),
        });
        io.emit("userLastSeenUpdated", { userId, lastseen: now });
        delete userSocketMap[userId];
        delete io.emit("getOnlineUsers", Object.keys(userSocketMap));
      } catch (error) {
        console.error("Error updating lastSeen:", error);
      }
    }
  });
});

export { app, server, io };
