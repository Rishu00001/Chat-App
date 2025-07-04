import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "https://wechat-22ij.onrender.com", // https://wechat-22ij.onrender.com
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
server.listen(PORT, () => {
  connectDB();
  console.log("App is running at port ", PORT);
});
