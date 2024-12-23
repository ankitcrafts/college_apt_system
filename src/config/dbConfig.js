import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME
    });
    console.log("Connected to MongoDB database(College-Appointment-System)!");
  } catch (err) {
    console.error("Error connecting to MySQL database:", err);
  }
};

export default connectToDatabase;

