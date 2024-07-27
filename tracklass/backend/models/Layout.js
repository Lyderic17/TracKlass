const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },

  layout: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null }
    }
  ]
});

module.exports = mongoose.model('Layout', LayoutSchema);
