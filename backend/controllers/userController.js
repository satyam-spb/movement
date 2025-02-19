// backend/controllers/userController.js
import User from '../models/user.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, privyUserId } = req.body;

        // Check if user already exists with this privyUserId
        const userExists = await User.findOne({ privyUserId });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            privyUserId,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                privyUserId: user.privyUserId,
                createdAt: user.createdAt,
                rewardModel: user.rewardModel // Include the reward model in the response
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        // Assuming the privyUserId is passed in the headers
        const privyUserId = req.headers['privy-user-id'];

        if (!privyUserId) {
            return res.status(400).json({ message: 'Privy user ID is required' });
        }

        const user = await User.findOne({ privyUserId: privyUserId });

        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                privyUserId: user.privyUserId,
                createdAt: user.createdAt,
                rewardModel: user.rewardModel // Include the reward model in the response
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user reward model
export const updateUserRewardModel = async (req, res) => {
    try {
        const { userId, rewardModel } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the reward model
        user.rewardModel = rewardModel;
        await user.save();

        res.json({ message: 'Reward model updated successfully', user });
    } catch (error) {
        console.error("Error updating reward model:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
