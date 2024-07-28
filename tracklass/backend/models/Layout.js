const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LayoutItemSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, required: true }, // 'table' or 'student'
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null } // Only for 'student' type
});

const LayoutSchema = new Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  className: { type: String, required: true },
  layout: [LayoutItemSchema]
});

module.exports = mongoose.model('Layout', LayoutSchema);
