const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const authenticateToken = require('../middleware/auth');

// All booking routes need protection
router.use(authenticateToken);

router.post('/', createBooking); // POST /api/bookings
router.get('/', getMyBookings);  // GET /api/bookings

module.exports = router;
