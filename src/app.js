import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true

}));
app.use(express.json({limit: '32kb'}));
app.use(express.urlencoded({ extended: true, limit: '32kb' })); //We can use nested objects in our form data
app.use(express.static('public'));
app.use(cookieParser());
//Routes
import userRouter from './routes/user.routes.js';
app.use("/api/v1/user", userRouter);
export { app };