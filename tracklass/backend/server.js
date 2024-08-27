const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pointsRoutes = require('./routes/pointsRoute');
const classRoutes = require('./routes/classRoutes');
const cors = require('cors');
const layoutRoutes = require('./routes/layoutRoutes');
const studentRoutes = require('./routes/studentRoutes');

require('dotenv').config();
const app = express();

// Connect to database
connectDB();

// CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
//points route
app.use('/api/points', pointsRoutes);

//class route
app.use('/api/classes', classRoutes);

//layout route
app.use('/api/layout', layoutRoutes);

//Student route
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
