// import exp from 'constants';
import express from 'express';
import path from 'path';
import logger from './middlewares/logger';
import url from 'url';
import userRouter from './routes/userRoutes';
import taskRouter from './routes/taskRoutes';

const PORT = process.env.PORT || 8080;

const app = express();  

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(logger);

const __filename = url.fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);

app.use('/profile',userRouter);
app.use('/tasks',taskRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
    
})