const Layout = require('../models/Layout');

// Get layout by classId
exports.getLayoutByClassId = async (req, res) => {
  const { classId } = req.params;
  try {
    const layout = await Layout.findOne({ classId });
    res.json(layout ? layout.layout : []);
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Server error while fetching layout' });
  }
};

// Save layout
exports.saveLayout = async (req, res) => {
  const { classId, className, layout } = req.body;
  try {
    let existingLayout = await Layout.findOne({ classId });

    if (existingLayout) {
      existingLayout.layout = layout.map(item => ({
        x: item.x,
        y: item.y,
        studentId: item.studentId || null,
        type: item.type
      }));
      existingLayout.className = className;
      await existingLayout.save();
    } else {
      const newLayout = new Layout({
        classId,
        className,
        layout: layout.map(item => ({
          x: item.x,
          y: item.y,
          studentId: item.studentId || null,
          type: item.type
        }))
      });
      await newLayout.save();
    }

    res.status(200).json({ message: 'Layout saved successfully' });
  } catch (error) {
    console.error('Error saving layout:', error); // Detailed error logging
    res.status(500).json({ error: 'Server error while saving layout' });
  }
};
