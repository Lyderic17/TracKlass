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
app.use(cors({
  origin: 'http://localhost:4200', // Remplacez ceci par l'URL de votre application Angular en production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Autoriser l'inclusion des cookies dans les requêtes
}));

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
