// backend/routes/userRoutes.js
import express from 'express';
// import { registerUser, getUserProfile, updateUserRewardModel } from '../controllers/userController.js';
// import { authenticateToken } from '../middlewares/authMiddleware.js';

import { verifyPrivyToken } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();
userRoutes.get('/profile', verifyPrivyToken, getOrCreateUser);
userRoutes.put('/rewardModel', verifyPrivyToken, updateRewardModel);
export default userRoutes;
