// backend/routes/userRoutes.js
import express from 'express';
import { registerUser, getUserProfile } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.get('/profile', getUserProfile);

export default userRoutes;
