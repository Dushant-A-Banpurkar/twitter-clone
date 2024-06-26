import mongoose from "mongoose";

const conectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default conectMongoDB;
