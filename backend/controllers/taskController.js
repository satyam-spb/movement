import express from 'express';

let tasks = [];

//get all tasks
// Get all tasks with optional limit
export const getAllTasks = (req, res, next) => {
    try {
        // Get the 'limit' query parameter (default is all tasks)
        const limit = parseInt(req.query.limit, 10);

        // Validate limit (should be a positive number)
        if (limit && (isNaN(limit) || limit <= 0)) {
            return res.status(400).json({ message: 'Invalid limit value. Must be a positive number.' });
        }

        // Return all tasks or a limited number
        const result = limit ? tasks.slice(0, limit) : tasks;
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Get a task by ID
export const getTask = (req, res, next) => {
    // Extract task ID from request parameters
    const taskId = req.params.id;
    // Find task in the array
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // If task is found, send task data
        res.status(200).json(task);
    } else {
        // If task is not found, send 404 status
        res.status(404).json({ message: 'Task not found' });
    }
}

// Create a new task
export const createTask = (req, res, next) => {
    // Create a new task object from request body
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    // Add new task to the array
    tasks.push(newTask);
    // Send the created task data with 201 status
    res.status(201).json(newTask);
}

// Delete a task by ID
export const deleteTask = (req, res, next) => {
    // Extract task ID from request parameters
    const taskId = req.params.id;
    // Find index of the task in the array
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        // Remove task from the array
        tasks.splice(taskIndex, 1);
        // Send 204 status to indicate successful deletion
        res.status(204).send();
    } else {
        // If task is not found, send 404 status
        res.status(404).json({ message: 'Task not found' });
    }
}
