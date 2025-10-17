import express from "express";
import {
  updateUser,
  userLogin,
  usersignup,
} from "../Controllers/User.Controller.js";
import adminOnly from "../middlewares/adminOnly.js";

const userRouter = express.Router();

userRouter.post("/usersignup", adminOnly, usersignup);
userRouter.post("/userLogin", userLogin);
userRouter.post("/updateUser/:id", updateUser);

export default userRouter;
