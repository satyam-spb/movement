import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    betAmount: { type: Number, required: true },
    duration: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add participants array
    trustworthyPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to chosen trustworthy person
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
