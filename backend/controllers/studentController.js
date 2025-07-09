// controllers/studentController.js
const Student = require('../models/Student');
const getCoordinatesFromAddress = require('../utils/geoCode');

exports.addStudent = async (req, res) => {
    try {
        const studentData = {
            ...req.body,
            parent: req.user._id
        };
        const address = req.body.address;
        if (address) {
            const coordinates = await getCoordinatesFromAddress(address);
            if (coordinates) {
                studentData.coordinates = {
                    lat: parseFloat(coordinates.lat),
                    lng: parseFloat(coordinates.lng),
                };
                console.log("📍 Final coordinates to save:", studentData.coordinates);
            } else {
                console.warn("❌ Coordinates not fetched — not saving location");
            }

        }
        const student = new Student(studentData);
        await student.save();
        res.status(201).json(student);

    } catch (err) {
        console.error("❌ Error adding student:", err.message);
        res.status(500).json({ message: err.message });
    }
};


exports.getUnassignedStudents = async (req, res) => {
    try {
        const students = await Student.find({ mentor: null });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
