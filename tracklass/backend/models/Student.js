const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add this line
});

module.exports = mongoose.model('Student', StudentSchema);
