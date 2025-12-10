// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <--- 1. Import CORS
const { createServer } = require('http');
const { Server } = require('socket.io');
const prisma = require('./prismaClient'); // <--- 2. Import Shared Prisma

const app = express();

// --- 3. CORS MUST BE HERE (BEFORE EVERYTHING) ---
app.use(cors()); // Allow ALL requests from ANYWHERE (Fixes the blocking error)

// --- 4. JSON PARSER ---
app.use(express.json());

const httpServer = createServer(app);

// --- 5. SOCKET IO SETUP ---
const io = new Server(httpServer, {
  cors: { origin: "*" } // Allow Socket connections from anywhere
});

// --- 6. ROUTES ---
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/bookings', bookingRoutes);
app.use('/chat', chatRoutes);

// --- 7. SOCKET LOGIC (Real-time) ---
io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join_room', (userId) => {
    if (userId) socket.join(userId.toString());
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;

    // Safety: Ensure IDs are numbers
    const sId = parseInt(senderId);
    const rId = parseInt(receiverId);

    if (isNaN(sId) || isNaN(rId)) return;

    try {
      // Save to DB
      const newMessage = await prisma.message.create({
        data: {
          content: content,
          sender: { connect: { id: sId } },
          receiver: { connect: { id: rId } }
        }
      });

      // Send to Receiver
      io.to(rId.toString()).emit('receive_message', newMessage);
      // Send back to Sender (so it shows on your screen too)
      socket.emit('receive_message', newMessage);

    } catch (err) {
      console.error("Message Save Error:", err);
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});
