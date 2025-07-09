// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { addStudent, getUnassignedStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware'); // if using JWT

router.post('/create', protect, addStudent);
router.get('/unassigned', protect, getUnassignedStudents);

module.exports = router;
