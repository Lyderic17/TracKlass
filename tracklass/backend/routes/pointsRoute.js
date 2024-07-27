const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Assurez-vous d'avoir un modèle Student

// Route pour obtenir les étudiants
router.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Route pour ajouter des points
router.post('/add', async (req, res) => {
  const { studentId, points } = req.body;
  const student = await Student.findById(studentId);
  if (student) {
    student.points += points;
    await student.save();
    res.json(student);
  } else {
    res.status(404).send('Student not found');
  }
});

// Route pour soustraire des points
router.post('/subtract', async (req, res) => {
  const { studentId, points } = req.body;
  const student = await Student.findById(studentId);
  if (student) {
    student.points -= points;
    await student.save();
    res.json(student);
  } else {
    res.status(404).send('Student not found');
  }
});

module.exports = router;
