const express = require('express');
const router = express.Router();
const {
  getApprovedMentors,
  getUnapprovedMentors,
  updateMentorApproval
} = require('../controllers/adminController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/admin/mentors/approved
router.get('/mentors/approved', protect, authorizeRoles('admin'), getApprovedMentors);

// GET /api/admin/mentors/unapproved
router.get('/mentors/unapproved', protect, authorizeRoles('admin'), getUnapprovedMentors);

// PATCH /api/admin/mentors/:id/approval
router.patch('/mentors/:id/approval', protect, authorizeRoles('admin'), updateMentorApproval);

module.exports = router;
