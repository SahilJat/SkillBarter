const prisma = require('../prismaClient');

// Get chat history between two users
const getHistory = async (req, res) => {
  try {
    const myId = req.user.id;
    const otherUserId = parseInt(req.params.id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId }
        ]
      },
      orderBy: { timestamp: 'asc' } // Oldest first
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

module.exports = { getHistory };
