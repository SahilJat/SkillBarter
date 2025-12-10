require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io')
const skillRoutes = require('./routes/skillRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const prisma = require('./prismaClient');
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
app.use('/skills', skillRoutes);
app.use('/bookings', bookingRoutes);
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('join_room', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their room`);
  });
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;

    try {
      // A. Save to Database (Peristance)
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content
        }
      });
      io.to(receiverId.toString()).emit('receive_message', newMessage);
      socket.emit('receive_message', newMessage);

    } catch (err) {
      console.error("Message Error:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SkillBarter Server running on Port ${PORT}`);
});
