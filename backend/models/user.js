import mongoose from 'mongoose';

const rewardModelSchema = new mongoose.Schema({
    betAmount: { type: Number, default: 0 }, // The amount the user bet on a specific task
    fee: { type: Number, default: 0 }, // The fee associated with the bet
    votes: { type: Number, default: 0 }, // Number of votes the user has cast
    profitLoss: { type: Number, default: 0 } // The profit or loss for this user
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    privyUserId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    rewardModel: { type: rewardModelSchema, default: () => ({}) } // Embed the reward model
});

const User = mongoose.model('User', userSchema);
export default User;
