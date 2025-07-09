const express = require('express');
const router = express.Router();
const {
  getStudentWiseInsights,
  getTopAndLeastPerformerInsights
} = require('../controllers/insightsController');

const { protect } = require('../middleware/authMiddleware');

router.get('/student-wise', protect, getStudentWiseInsights);
router.get('/top-vs-least', protect, getTopAndLeastPerformerInsights);

module.exports = router;
