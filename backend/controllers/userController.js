// backend/controllers/userController.js
import User from '../models/user.js';

// Register a new user
export const registerUser = async (req, res) => {
    // Registration logic here...
};

// Get user profile
export const getUserProfile = async (req, res) => {
    // Profile fetching logic here...
};

const DEFAULT_REWARD_MODEL = {
  betAmount: 0,
  fee: 0.1,
  votes: 0,
  profitLoss: 0
};

// Get userId or create new using privy auth
export const getOrCreateUser = async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { privyId: req.user.privyId },
        { 
          $setOnInsert: { 
            email: req.user.email,
            rewardModel: DEFAULT_REWARD_MODEL 
          } 
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );
  
      res.json({
        id: user._id,
        privyId: user.privyId,
        rewardModel: user.rewardModel,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Update user reward model
export const updateUserRewardModel = async (req, res) => {
    try {
        const userId = req.user.privyId;
        const { rewardModel } = req.body;

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
