import mongoose from "mongoose";

export async function connect() {
  // safer readyState check
  if (mongoose.connection.readyState === 1) return;

  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment");
    }

    console.log("Connecting to MongoDB with URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connection successfully established.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(error.message || "Error connecting to database");
  }
}