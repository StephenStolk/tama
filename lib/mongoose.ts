// lib/mongoose.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI!; // Your MongoDB connection URI from MongoDB Atlas

// A mongoose singleton pattern to avoid multiple connections during hot reloading in development
async function connectToDatabase() {
  if (mongoose.connections[0].readyState === 1) {
    return mongoose.connection;
  }

  try {
    console.log("Connecting to MongoDB...");
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connection successful.");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to the database. Please try again later.");
  }
}

export default connectToDatabase;
