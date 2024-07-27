const Student = require('../models/Student');

// Create a new student
exports.createStudent = async (req, res) => {
  const { name, classId, points } = req.body;
  try {
    const newStudent = new Student({ name, classId, points, userId: req.user.id });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).send('Server error');
  }
};

// Get students by class
exports.getStudentsByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const students = await Student.find({ classId, userId: req.user.id });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Server error');
  }
}

  // Fetch all students for the logged-in user
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Server error');
  }
};

// Add points to a student
exports.addPoints = async (req, res) => {
  const { studentId } = req.params;
  const { points } = req.body;
  try {
    const student = await Student.findOne({ _id: studentId, userId: req.user.id });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    student.points += points;
    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).send('Server error');
  }
};

// Subtract points from a student
exports.subtractPoints = async (req, res) => {
  const { studentId } = req.params;
  const { points } = req.body;
  try {
    const student = await Student.findOne({ _id: studentId, userId: req.user.id });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    student.points -= points;
    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error subtracting points:', error);
    res.status(500).send('Server error');
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findOneAndDelete({ _id: studentId, userId: req.user.id });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json({ msg: 'Student removed' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Server error');
  }
};

