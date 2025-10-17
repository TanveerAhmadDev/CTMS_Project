import express from "express";
import {
  addstudent,
  createsection,
  findSectionById,
  getAllSections,
  studentWithNoSection,
} from "../Controllers/Section.Controller.js";
import adminOnly from "../middlewares/adminOnly.js";
const sectionRouter = express.Router();

sectionRouter.post("/createsection", adminOnly, createsection);
sectionRouter.post("/addstudent", adminOnly, addstudent);
sectionRouter.get("/getsections", getAllSections);
sectionRouter.get("/findSectionById/:id", findSectionById);
sectionRouter.get("/studentWithNoSection", studentWithNoSection);

export default sectionRouter;
