import express from "express";
import { courseModel } from "../../schemas/course.schema.js";
import { moduleModel } from "../../schemas/module.schema.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await courseModel.find();  // Fetch all courses
        res.send(courses);
    } catch (err) {
        res.status(500).send({ message: "Error fetching courses", error: err });
    }
});

// Get a course by ID and its modules
router.get("/:course_id", async (req, res) => {
    const { course_id } = req.params;

    try {
        const course = await courseModel.findById(course_id);

        if (course) {
            res.send(course);  // Course and its populated modules
        } else {
            res.status(404).send({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error fetching course", error: err });
    }
});

// Unlock a course
router.put("/:course_id/unlock", async (req, res) => {
    const { course_id } = req.params;

    try {
        const course = await courseModel.findById(course_id);

        if (course) {
            course.isLocked = false;
            await course.save();
            res.send(course);
        } else {
            res.status(404).send({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error unlocking course", error: err });
    }
});

export default router;
