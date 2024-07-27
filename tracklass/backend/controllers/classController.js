const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Assuming user ID is available in req.user
  try {
    const newClass = new Class({ name, userId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).send('Server error');
  }
};

// Get classes for the logged-in user
exports.getClasses = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user
  try {
    const classes = await Class.find({ userId });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).send('Server error');
  }
};
