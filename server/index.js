import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import cors from 'cors';

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
})

