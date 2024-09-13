import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }], // Store references to Module IDs
    isLocked: { type: Boolean, default: true },
});

export const courseModel = mongoose.model("Course", courseSchema); // Export the model
