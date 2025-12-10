const express = require('express');
const router = express.Router();
const { createSkill, getAllSkills, getMySkills } = require('../controllers/skillController');
const authenticateToken = require('../middleware/auth');


router.get('/', getAllSkills);


router.post('/', authenticateToken, createSkill);
router.get('/mine', authenticateToken, getMySkills);

module.exports = router;
