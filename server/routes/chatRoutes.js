const express = require('express');
const router = express.Router();
const { getHistory, getInbox } = require('../controllers/chatController');
const authenticateToken = require('../middleware/auth');

router.get('/:id', authenticateToken, getHistory);
router.get('/inbox', authenticateToken, getInbox);
module.exports = router;
