import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userModel } from "../schemas/user.schema.js";
import { dbConnect } from "./index.js";
import { moduleModel } from "../schemas/module.schema.js";
import { courseModel } from "../schemas/course.schema.js";
import { mongoModule } from "../Database/mongoModules.js";
import { mongoCourse } from "../Database/mongoCourses.js";

//New file created to seed modules and courses table in the database.

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

async function seedDB() {
    console.log("Inside seedDB");
    dbConnect();
    await userModel.deleteMany({});
    await moduleModel.deleteMany({});
    await courseModel.deleteMany({});
    console.log("DB cleared");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("secret", salt);

    const user = {
      _id: mongoose.Types.ObjectId(1),
      name: "Admin",
      email: "admin@jsonapi.com",
      password: hashPassword,
      created_at: new Date(),
      profile_image: "../../images/admin.jpg",
    };

    const admin = new userModel(user);
    await admin.save();

    console.log("Seeding Modules");
    const moduleIds = [];

    for (const module of mongoModule) {
      const newModule = new moduleModel(module);
      await newModule.save();
      moduleIds.push(newModule._id);
    }

    console.log("Modules seeded successfully");
    console.log("Starting courses seeding.");

    for (const course of mongoCourse) {
      const shuffledModuleIds = shuffleArray([...moduleIds]);
      const courseModules = shuffledModuleIds.slice(0, 8);

      const newCourse = new courseModel({
        title: course.title,
        description: course.Description,
        modules: courseModules,
        isLocked: course.isLocked || true,
      });
      await newCourse.save();
    }

    console.log("Courses seeded successfully");
    console.log("DB seeded");
  }

  seedDB().then(() => {
    mongoose.connection.close();
  });