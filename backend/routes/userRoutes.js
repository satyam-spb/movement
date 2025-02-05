import exp from 'constants';
import express from 'express';
import { getUser,createUser,updateUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();

//GET user data
userRouter.get('/',getUser);

//POST user data (create new user)
userRouter.post('/',createUser);


//Update user data
userRouter.put('/',updateUser);

//delete user
userRouter.delete('/',deleteUser);

export default userRouter;