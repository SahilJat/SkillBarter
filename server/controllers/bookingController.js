const prisma = require('../prismaClient');


const createBooking = async (req, res) => {
  const { skillId, date } = req.body;
  const buyerId = req.user.id;

  try {

    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    if (skill.ownerId === buyerId) return res.status(400).json({ error: "You cannot book your own skill!" });


    const result = await prisma.$transaction(async (prisma) => {


      const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
      if (buyer.credits < 1) {
        throw new Error("Insufficient credits! Offer a skill to earn more.");
      }


      await prisma.user.update({
        where: { id: buyerId },
        data: { credits: { decrement: 1 } }
      });


      await prisma.user.update({
        where: { id: skill.ownerId },
        data: { credits: { increment: 1 } }
      });

      // D. Create the Booking Receipt
      const booking = await prisma.booking.create({
        data: {
          buyerId: buyerId,
          sellerId: skill.ownerId,
          skillId: skillId,
          date: new Date(date),
          status: "CONFIRMED"
        }
      });

      return booking;
    });

    res.json({ message: "Booking Confirmed!", booking: result });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Booking failed" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    // Find bookings where I am the Buyer OR the Seller
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { buyerId: req.user.id },
          { sellerId: req.user.id }
        ]
      },
      include: {
        skill: true,  // Show skill details
        buyer: { select: { name: true } }, // Show who bought it
        seller: { select: { name: true } } // Show who sold it
      }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = { createBooking, getMyBookings };
