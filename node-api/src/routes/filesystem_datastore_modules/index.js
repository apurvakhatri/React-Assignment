/*
This file was used to fetch data directly from the json file. It is no longer used rather an advance version where initially data is
seeded into mongoDB and then routes are fetched from mongoDB is used. New file location: routes>modules>index.js.

This file proposes an alternate approach using file-system as database.
In-order to use this file it needs to be added in routes>index.js and used.
*/



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