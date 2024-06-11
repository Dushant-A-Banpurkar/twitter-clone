import express from 'express';
import authRoutes from "./routes/auth_routes.js"
import dotenv from 'dotenv'
import connectMongoDB from './Database/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app=express();


//middlewer
app.use(express.json());//to parse req.body
app.use(express.urlencoded({ extended: true }));//to parse from data(urlencoded)


app.use(cookieParser());//This pasre the request. so would get the cookies

app.use("/api/auth",authRoutes);

const PORT=process.env.PORT;


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})