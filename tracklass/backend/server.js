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

const allowedOrigins = [
  'http://localhost:4200', // Local development
  'https://tracklass.vercel.app', // Deployed frontend
  'https://tracklass-6gsarnu05-lyderics-projects-d9645fc0.vercel.app', // Deployed frontend
  'https://tracklass-9y38q5ni2-lyderics-projects-d9645fc0.vercel.app/'
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or CURL requests)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Autoriser l'inclusion des cookies dans les requêtes
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));

// Add custom headers for preflight responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-auth-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Respond to preflight requests
    return;
  }

  next();
});
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
