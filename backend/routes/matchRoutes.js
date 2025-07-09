const express = require('express');
const router = express.Router();
const { suggestMentorMatch, approveMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggest/:studentId', protect, suggestMentorMatch);
router.post('/approve', protect, approveMatch);

module.exports = router;
