import Task from '../models/task.js';
import User from '../models/user.js'; 
import { validationResult } from 'express-validator';

// Create a new task/bet
export const createTask = async (req, res) => {
  console.log("In create task");
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("task validated");
    
    const { 
      title, 
      description, 
      betAmount, 
      duration, 
      participants, 
      trustworthyPerson, 
      groupCode
    } = req.body;

    console.log("data received - taskController");
    

    // Get creatorPrivyId from authenticated user
    const creatorPrivyId = req.user.privyId; // Changed from req.body to req.user
    console.log("privy id of cretor : ", creatorPrivyId);
    

    const user = await User.findOne({ privyId: creatorPrivyId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('craeting task');
    
    // Create the task/bet
    const task = new Task({
      title,
      description,
      betAmount,
      duration,
      creator: user._id,
      participants,
      trustworthyPerson,
      groupCode
    });
    console.log("Task created");
    

    await task.save();
    console.log("task saved");
    
    // Return the created task with populated user information
    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('participants', 'name email')
      .populate('trustworthyPerson', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('creator', 'name email')
      .populate('participants', 'name email')
      .populate('trustworthyPerson', 'name email');
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join a bet group using group code
export const joinBetGroup = async (req, res) => {
  try {
    const { groupCode } = req.body;
    const userId = req.user._id; // User ID from authentication middleware
    
    // Find the task/bet with the provided group code
    const task = await Task.findOne({ groupCode });
    
    if (!task) {
      return res.status(404).json({ message: 'Bet group not found with this code' });
    }
    
    // Check if user is already a participant
    if (task.participants.includes(userId)) {
      return res.status(400).json({ message: 'You are already a participant in this bet' });
    }
    
    // Add user to participants
    task.participants.push(userId);
    await task.save();
    
    res.json({ message: 'Successfully joined bet group', task });
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
    
    // Check if the trustworthy person is a participant
    if (!task.participants.includes(trustworthyPersonId)) {
      return res.status(400).json({ error: 'Selected person must be a participant' });
    }
    
    // Update the task with the selected trustworthy person
    task.trustworthyPerson = trustworthyPersonId;
    await task.save();
    
    res.json({ message: 'Trustworthy person selected successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('participants', 'name email')
      .populate('trustworthyPerson', 'name email');
      
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
      creator: req.user._id
    });
    
    if (!task) return res.status(404).json({ error: 'Task not found or you are not the creator' });
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('creator participants trustworthyPerson');
    
    res.json(updatedTask);
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
      creator: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you are not the creator' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};