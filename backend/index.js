// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load from both potential .env file locations
// First try the backend folder
dotenv.config({ path: path.join(__dirname, '.env') });
// If PRIVY_APP_ID is still undefined, try the root folder
if (!process.env.PRIVY_APP_ID) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Debug environment variables
console.log('Environment Variables After Loading:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('PRIVY_APP_ID:', process.env.PRIVY_APP_ID ? process.env.PRIVY_APP_ID : 'Not set');
console.log('PRIVY_APP_SECRET:', process.env.PRIVY_APP_SECRET ? '[Secret is set]' : 'Not set');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(morgan('dev')); // for logging

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Handle the double /api issue by redirecting /api/api/* requests to /api/*
app.use((req, res, next) => {
    if (req.url.startsWith('/api/api/')) {
        // Remove the extra /api prefix
        req.url = req.url.replace('/api/api/', '/api/');
    }
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Define a simple error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;
  
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
      validation: err.errors,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
};

// Error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});