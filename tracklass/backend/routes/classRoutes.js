const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middlewares/auth'); // Assuming you have an auth middleware

// Route to create a new class
router.post('/', authMiddleware, classController.createClass);

// Route to get all classes for the logged-in user
router.get('/', authMiddleware, classController.getClasses);

router.get('/:classId', classController.getClassById);

module.exports = router;
