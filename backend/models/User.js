const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    phone: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'mentor', 'parent'],
        default: 'parent'
    },
    isApproved: {type: Boolean, default: false},
    bio: String,
    expertise: [String],
    languages: [String],
    assignedStudents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

module.exports = mongoose.model('User', userSchema)