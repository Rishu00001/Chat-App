import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully connected to database");
  } catch (error) {
    console.log("Error while connecting to database", error);
  }
};

export default connectDB;