
/*
This file was used to fetch data directly from the json file. It is no longer used rather an advance version where initially data is
seeded into mongoDB and then routes are fetched from mongoDB is used. New file location: routes>courses>index.js.

This file proposes an alternate approach using file-system as database.
In-order to use this file it needs to be added in routes>index.js and used.
*/


import express from "express";
import db from "../../Database/index.js"

const router = express.Router();

router.get("/", (req, res) => {
    const courses = db.courses;
    res.send(courses);
});

router.get("/:course_id", (req, res) => {
    const { course_id } = req.params;
    const course = db.courses.find((c) => c.id === course_id);

    if (course) {
      // Fetch Modules for the course
      const modulesWithDetails = course.Modules.map((moduleId) => {
        const module = db.modules.find((m) => m.id === moduleId);
        // Return either the found module or a placeholder
        return (
          module || {
            id: moduleId,
            title: "Unknown",
            slide: "",
            video: "",
            text: "",
            isLocked: true,
          }
        );
      });

      // Create a new course object with the modules populated
      const courseWithModules = { ...course, Modules: modulesWithDetails };

      res.send(courseWithModules);
    } else {
      res.status(404).send({ message: "Course not found" });
    }
  });

  router.put("/:course_id/unlock", (req, res) => {
    const { course_id } = req.params;
    const course = db.courses.find((c) => c.id === course_id);

    if (course) {
      course.isLocked = false;
      res.send(course);
    } else {
      res.status(404).send({ message: "Course not found" });
    }
  });

export default router;