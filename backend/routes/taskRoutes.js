import express from 'express';
import { getAllTasks, getTask, createTask, deleteTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

//get all tasks
taskRouter.get('/',getAllTasks);

//get a single task info
taskRouter.get('/:id',getTask);

//POST(Create new Task)
taskRouter.post('/',createTask);

//Delete Task
taskRouter.delete('/:id',deleteTask);

export default taskRouter;