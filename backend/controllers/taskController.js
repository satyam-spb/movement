import Task from '../models/task.js';
import { validationResult } from 'express-validator';
//to be edited
const DEFAULT_USER_ID = '67a4af8c2332ec00fc5c0873'; // Replace with a valid user ID from your database. remove this when the login is implemented

// Create a new task
// export const createTask = async (req, res) => {
//     console.log("CreateTask function called");
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log("Validation errors:", errors.array());
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { title, description, betAmount, duration, participants } = req.body;
//         console.log("Request body:", req.body);

//         const task = await Task.create({
//             title,
//             description,
//             betAmount,
//             duration,
//             creator: req.user.privyId, 
//             participants: participants
//         });

//         console.log("Task created successfully:", task);
//         res.status(201).json(task);
//     } catch (error) {
//         console.error("Error creating task:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

export const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { title, description, betAmount, duration, participants } = req.body;
      
      const task = await Task.create({
        title,
        description,
        betAmount,
        duration,
        creator: req.user.privyId, // Use authenticated user's privyId
        participants
      });
  
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            creator: req.user.privyId
          });
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
// export const selectTrustworthyPerson = async (req, res) => {
//     try {
//         const { taskId, trustworthyPersonId } = req.body;

//         const task = await Task.findById(taskId);

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }


//         if (!task.participants.includes(trustworthyPersonId)) {
//             return res.status(400).json({ error: 'Invalid participant' });
//           }
//         // Update the task with the selected trustworthy person
//         task.trustworthyPerson = trustworthyPersonId;
//         await task.save();

//         res.json({ message: 'Trustworthy person selected' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

export const selectTrustworthyPerson = async (req, res) => {
    try {
      const { taskId, trustworthyPersonId } = req.body;
      const userId = req.user.privyId;
  
      const task = await Task.findOne({
        _id: taskId,
        creator: userId // Verify task ownership
      });
  
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (!task.participants.includes(trustworthyPersonId)) {
        return res.status(400).json({ error: 'Invalid participant' });
      }
  
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
        const task = await Task.findById(req.params.id);
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
      const task = await Task.findOne({
        _id: req.params.id,
        creator: req.user.privyId
      });
      
      if (!task) return res.status(404).json({ error: 'Task not found' });
      
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
