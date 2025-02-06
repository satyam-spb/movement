import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, },
  betAmount :{ type: Number, required: true },
  duration :{ type: Number, required: true },
  creator:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},  
  createdAt: { type: Date, default: Date.now },
completed :{type: Boolean, default: false},
});

const Task = mongoose.model('Task', taskSchema);  
export default Task;