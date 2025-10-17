import express from "express";
import { createTask, deleteTask } from "../Controllers/Task.Controller.js";
import CrChecking from "../middlewares/CrChecking.js";

const taskRouter = express.Router();

taskRouter.post("/addtask", CrChecking, createTask);
taskRouter.delete("/deletetask/:id", CrChecking, deleteTask);

export default taskRouter;
