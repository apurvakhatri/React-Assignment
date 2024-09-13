import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slide: { type: String, required: true },
    video: { type: String, required: true },
    text: { type: String, required: true },
    isLocked: { type: Boolean, default: true },
});