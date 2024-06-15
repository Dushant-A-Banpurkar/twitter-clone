import path from "path";
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware sections
app.use(express.json({ limit: "10mb" })); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data (urlencoded)
app.use(cookieParser()); // parse request cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
