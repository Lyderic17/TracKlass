const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/auth');

// Route to create a new student
router.post('/', authMiddleware, studentController.createStudent);

// Route to get students by class
router.get('/class/:classId', authMiddleware, studentController.getStudentsByClass);

//points related
// Fetch all students
router.get('/', authMiddleware, studentController.getStudents);

// Add points to a student
router.put('/:studentId/addPoints', authMiddleware, studentController.addPoints);

// Subtract points from a student
router.put('/:studentId/subtractPoints', authMiddleware, studentController.subtractPoints);

// delete a student
router.delete('/:studentId', authMiddleware, studentController.deleteStudent);

module.exports = router;
