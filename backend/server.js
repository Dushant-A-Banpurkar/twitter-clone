import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import postRoutes from "./routes/post_routes.js";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import notificationRoutes from "./routes/notification_routes.js";
import connectMongoDB from "./Database/connectMongoDB.js";

dotenv.config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

//middlewer sections
app.use(express.json({limit:"10mb"})); //to parse req.body
//limit is increase.because we can't upload image by default
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)

app.use(cookieParser()); //This pasre the request. so would get the cookies

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});
