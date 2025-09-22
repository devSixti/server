import mongoose from "mongoose";
import { envValues } from "./env.config";

export const connectDb = async () => {
  try {
    const { dbUrl } = envValues;
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    await mongoose.disconnect();
    console.error("Disconnected from MongoDB");
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
