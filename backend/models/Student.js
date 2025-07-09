const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  social: { level: Number, note: String },
  creative: { level: Number, note: String },
  moral: { level: Number, note: String },
  note: String,
  photoUrl: String,  
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  address: String,
  skillTags: [String], 
  parentContact: String,
  languages: [String],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: [progressSchema],
  certificates: [{
    milestone: String,
    fileUrl: String,
    issuedAt: Date
  }],
  coordinates: {
    lat: Number,
    lng: Number
  }

});

module.exports = mongoose.model('Student', studentSchema);
