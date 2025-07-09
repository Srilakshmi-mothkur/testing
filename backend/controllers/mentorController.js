const Student = require('../models/Student');

// GET /api/mentor/students
const getAssignedStudents = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const students = await Student.find({ mentor: mentorId })
      .select('name age gender skillTags progress') // send only required fields
      .sort({ name: 1 });

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

module.exports = {
  getAssignedStudents
};
