import mongoose from "mongoose";

const feedBackModel = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  feedBack: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});
const FeedBack = mongoose.model("FeedBack", feedBackModel);
export default FeedBack;
