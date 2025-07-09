const User = require('../models/User');
const twilio = require('twilio');
const { sendSMS, sendWhatsApp } = require('../utils/sendNotification');

// GET: All approved mentors
exports.getApprovedMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', isApproved: true });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: All unapproved mentors
exports.getUnapprovedMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', isApproved: false });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH: Approve/disapprove a mentor
exports.updateMentorApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const mentor = await User.findById(id);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    mentor.isApproved = isApproved;
    await mentor.save();

    if (isApproved && mentor.phone) {
      const phone = mentor.phone;
      const messageBody = `Hello ${mentor.name}, your profile has been ${isApproved ? 'approved' : 'rejected'}.`;

      // 🔔 Use centralized utils
      await sendSMS(phone, messageBody);
      await sendWhatsApp(phone, messageBody);
    }

    res.json({ message: `Mentor ${isApproved ? 'approved' : 'disapproved'}.` });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: err.message });
  }
};