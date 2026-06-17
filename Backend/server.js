import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";

import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";

const app = express();

//Database connection
await connectDB();

const PORT = process.env.PORT || 5001;

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Car Rental Management System Backend is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/bookings", bookingRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

const onlineUsers = new Map();

global.onlineUsers = onlineUsers;

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    if (!userId) return;
    onlineUsers.set(userId.toString(), socket.id);
    socket.userId = userId.toString();
    console.log(`User ${userId} joined socket ${socket.id}`);
  });

  socket.on('leave', (userId) => {
    if (!userId) return;
    onlineUsers.delete(userId.toString());
    socket.leave(userId.toString());
    console.log(`User ${userId} left`);
  });

  socket.on('join_chat', (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on('leave_chat', (chatId) => {
    if (!chatId) return;
    socket.leave(chatId);
  });


  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log(`Socket disconnected ${socket.id}, removed user ${socket.userId}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
