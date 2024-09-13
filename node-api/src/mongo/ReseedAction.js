import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userModel } from "../schemas/user.schema.js";
import { dbConnect } from "./index.js";
import { moduleModel } from "../schemas/module.schema.js";
import { courseModel } from "../schemas/course.schema.js";
import { mongoModule } from "../Database/mongoModules.js";
import { mongoCourse } from "../Database/mongoCourses.js";

const ReseedAction = () => {
  async function clear() {
    console.log("Inside clear");
    dbConnect();
    await userModel.deleteMany({});
    await moduleModel.deleteMany({}); // Clear modules
    await courseModel.deleteMany({}); // Clear courses
    console.log("DB cleared");
  }

  async function seedDB() {
    console.log("Inside seedDB");
    await clear();
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
        description: course.description,
        modules: courseModules,
        isLocked: course.isLocked || true,
      });
      await newCourse.save();
    }

    console.log("Courses seeded successfully");
    console.log("DB seeded");
  }

  seedDB();
};

export default ReseedAction;
