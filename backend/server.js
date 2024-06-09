import express from 'express';
import authRoutes from "./routes/auth_routes.js"
import dotenv from 'dotenv'
import connectMongoDB from './Database/connectMongoDB.js';
import { connect } from 'mongoose';
const app=express();

app.use("/api/auth",authRoutes)

dotenv.config();
const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})