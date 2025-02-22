import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    betAmount: { type: Number, required: true },
    duration: { type: Number, required: true },
    creator: { 
        type: String, // Store privyId instead of ObjectId
        required: true 
      },
    createdAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    participants: [{
        type: String // Store privyIds
      }],
      trustworthyPerson: { 
        type: String // Store privyId 
      }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
