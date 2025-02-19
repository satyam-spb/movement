import express from 'express';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    selectTrustworthyPerson
} from '../controllers/taskController.js';
//to be edited
// import { authenticateToken } from '../middlewares/authMiddleware.js'; Remove this
import { body } from 'express-validator';

const taskRoutes = express.Router();

// Validation rules for task creation
const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('betAmount').isNumeric().withMessage('Bet amount must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('participants').isArray().withMessage('Participants must be an array') // Validate participants
];

// Create a new task (protected route)
//to be edited
taskRoutes.post('/', taskValidationRules, createTask); //Remove Authenticate token

// Select a trustworthy person for the task
taskRoutes.post('/selectTrustworthy', selectTrustworthyPerson);

// Get all tasks
taskRoutes.get('/', getAllTasks);

// Get task by ID
taskRoutes.get('/:id', getTaskById);

// Update a task (protected route)
taskRoutes.put('/:id', updateTask);

// Delete a task (protected route)
taskRoutes.delete('/:id', deleteTask);

export default taskRoutes;
