import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
    currentResumeId: {
      type: String,
    },
    currentLinkedInId: {
      type: String,
    },
    totalCredits: {
      type: Number,
      default: 0,
    },
    isChanged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
