const express = require('express');
const router = express.Router();
const { handleMentorChat } = require('../controllers/mentorChatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mentor/chat', protect, handleMentorChat);

module.exports = router;
