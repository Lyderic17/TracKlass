const express = require('express');

const {register, login} = require('../controllers/authController'); // Import register and login functions from authController
const router = express.Router();

// Inscription
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;
