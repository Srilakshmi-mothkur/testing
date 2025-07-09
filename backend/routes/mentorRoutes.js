const express = require('express');
const router = express.Router();
const { getAssignedStudents } = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/students', protect, getAssignedStudents);

module.exports = router;
