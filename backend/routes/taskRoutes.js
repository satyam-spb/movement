import express from 'express';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const taskRoutes = express.Router();

// Validation rules for task creation
const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('betAmount').isNumeric().withMessage('Bet amount must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number')
];

// Create a new task (protected route)
taskRoutes.post('/', authenticateToken, taskValidationRules, createTask);

// Get all tasks
taskRoutes.get('/', authenticateToken, getAllTasks);

// Get task by ID
taskRoute.get('/:id', authenticateToken, getTaskById);

// Update a task (protected route)
taskRoutes.put('/:id', authenticateToken, updateTask);

// Delete a task (protected route)
taskRoutes.delete('/:id', authenticateToken, deleteTask);

export default taskRoutes;
