const express = require('express');
const router = express.Router();
const Layout = require('../models/Layout');
const layoutController = require('../controllers/layoutController');

// Route to get layout by classId
router.get('/:classId', layoutController.getLayoutByClassId);

// Route to save layout
router.post('/', layoutController.saveLayout);
  
  module.exports = router;
