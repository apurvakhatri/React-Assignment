import express from "express";
import db from "../../Database/index.js"

const router = express.Router();

router.get("/", (req, res) => {
    const modules = db.modules;
    res.send(modules);
});

router.get("/:module_id", (req, res) => {
    const { module_id } = req.params;
    const module = db.modules.find(m => m.id === module_id);

    if(module){
        res.send(module);
    }
    else{
        res.status(404).send({ message: "Module not found" });
    }
})

export default router;