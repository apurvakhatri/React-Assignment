import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slide: { type: String, required: true },
    video: { type: String, required: true },
    text: { type: String, required: true },
});

// export const moduleSchemaOnly = moduleSchema; // Export the schema
export const moduleModel = mongoose.model("Module", moduleSchema); // Export the model
