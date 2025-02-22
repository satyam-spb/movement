// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv' 
import path from 'path'
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';


import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(morgan('dev')); // for logging

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes); 

//error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
