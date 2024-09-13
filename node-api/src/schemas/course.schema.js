import mongoose from "mongoose";
import moduleSchema from "./module.schema.js"

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: [moduleSchema],
  });

export const Course = mongoose.model("Course", courseSchema);
