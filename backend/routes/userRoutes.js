// backend/routes/userRoutes.js
import express from 'express';
import { registerUser, getUserProfile, updateUserRewardModel } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.get('/profile', authenticateToken, getUserProfile);
userRoutes.put('/rewardModel', authenticateToken, updateUserRewardModel); // Add the route to update reward model

export default userRoutes;
