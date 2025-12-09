require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" }
});

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SkillBarter Server running on Port ${PORT}`);
});
