import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected Successfully!!");
  } catch (error) {
    console.log("Connection Error while Connecting MongoDB", error);
  }
};
