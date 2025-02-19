import Task from '../models/task.js';
import { validationResult } from 'express-validator';
//to be edited
const DEFAULT_USER_ID = '67a4af8c2332ec00fc5c0873'; // Replace with a valid user ID from your database. remove this when the login is implemented

// Create a new task
export const createTask = async (req, res) => {
    console.log("CreateTask function called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, betAmount, duration, participants } = req.body;
        console.log("Request body:", req.body);

        const task = await Task.create({
            title,
            description,
            betAmount,
            duration,
            //to be edited
            creator: DEFAULT_USER_ID, // Use the default user ID. Remove this and make it blank once implemented the login
            participants: participants
        });

        console.log("Task created successfully:", task);
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('creator', 'name email').populate('participants', 'name email'); // Populate creator and participants details
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Select a trustworthy person for a task
export const selectTrustworthyPerson = async (req, res) => {
    try {
        const { taskId, trustworthyPersonId } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task with the selected trustworthy person
        task.trustworthyPerson = trustworthyPersonId;
        await task.save();

        res.json({ message: 'Trustworthy person selected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('creator', 'name email').populate('participants', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
