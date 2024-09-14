import express from "express";
import { moduleModel } from "../../schemas/module.schema.js";

const router = express.Router();

// Fetch all modules
router.get("/", async (req, res) => {
  try {
    const modules = await moduleModel.find();
    res.send(modules);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch modules" });
  }
});

// Fetch a specific module by ID
router.get("/:module_id", async (req, res) => {
  const { module_id } = req.params;

  try {
    const module = await moduleModel.findById(module_id);

    if (module) {
      res.send(module);
    } else {
      res.status(404).send({ message: "Module not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch module details" });
  }
});

export default router;
