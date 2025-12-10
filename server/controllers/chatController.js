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
const getInbox = async (req, res) => {
  try {
    const myId = req.user.id;

    // 1. Find all messages involving me
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: myId }, { receiverId: myId }]
      },
      orderBy: { timestamp: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } }
      }
    });

    // 2. Extract unique partners
    const partnersMap = new Map();

    messages.forEach(msg => {
      const isMeSender = msg.senderId === myId;
      const partner = isMeSender ? msg.receiver : msg.sender;

      // Only add if not already in map
      if (!partnersMap.has(partner.id)) {
        partnersMap.set(partner.id, {
          user: partner,
          lastMessage: msg.content,
          timestamp: msg.timestamp
        });
      }
    });

    // Convert map to array
    res.json(Array.from(partnersMap.values()));

  } catch (err) {
    res.status(500).json({ error: "Failed to load inbox" });
  }
};

module.exports = { getHistory, getInbox };

