import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({});

const Job = mongoose.model("Job", jobSchema);
export default Job;
