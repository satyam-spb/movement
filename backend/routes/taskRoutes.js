import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    selectTrustworthyPerson,
    joinBetGroup
} from '../controllers/taskController.js';

import { body } from 'express-validator';
import { verifyPrivyToken } from '../middlewares/authMiddleware.js';

const taskRoutes = express.Router();
console.log("In the task routes");


// Validation rules for task creation
const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('betAmount').isNumeric().withMessage('Bet amount must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('participants').isArray().withMessage('Participants must be an array')
];

console.log("Task validated");


// Get all available users
taskRoutes.get('/users', getAllUsers);

// Create a new task (protected route)
console.log("Just before task post");

taskRoutes.post('/', verifyPrivyToken, taskValidationRules, createTask);

// Join a bet group using group code
taskRoutes.post('/join', verifyPrivyToken, [
    body('groupCode').notEmpty().withMessage('Group code is required')
], joinBetGroup);

// Select a trustworthy person for the task
taskRoutes.post('/selectTrustworthy', verifyPrivyToken, [
    body('taskId').notEmpty().withMessage('Task ID is required'),
    body('trustworthyPersonId').notEmpty().withMessage('Trustworthy person ID is required')
], selectTrustworthyPerson);

// Get all tasks
taskRoutes.get('/', getAllTasks);

// Get task by ID
taskRoutes.get('/:id', getTaskById);

// Update a task (protected route)
taskRoutes.put('/:id', verifyPrivyToken, updateTask);

// Delete a task
taskRoutes.delete('/:id', verifyPrivyToken, deleteTask);

export default taskRoutes;