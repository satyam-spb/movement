// backend/routes/userRoutes.js
import express from 'express';
import { getOrCreateUser, updateUserRewardModel } from '../controllers/userController.js'; // Importing necessary functions
import { verifyPrivyToken } from '../middlewares/authMiddleware.js';
import { getAllUsers } from '../controllers/userController.js'; // Ensure this import is correct


const userRoutes = express.Router();
userRoutes.get('/', getAllUsers); // Define the route for getting all users

userRoutes.get('/profile', verifyPrivyToken, getOrCreateUser); // Using getOrCreateUser function
userRoutes.put('/rewardModel', verifyPrivyToken, updateUserRewardModel); // Using updateUserRewardModel function

export default userRoutes;
