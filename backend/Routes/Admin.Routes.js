import express from "express";
import {
  admindashboard,
  adminlogin,
  adminlogout,
  adminregister,
  forgotPassword,
  verification,
  verifyOtp,
} from "../Controllers/Admin.Controller.js";
import adminOnly from "../middlewares/adminOnly.js";
import { isAuthenticated } from "../middlewares/isAuthenticared.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminregister);
adminRouter.post("/verify", verification);
adminRouter.post("/adminlogin", adminlogin);
adminRouter.post("/adminlogout", isAuthenticated, adminlogout);
adminRouter.post("/forgotpassword", forgotPassword);
adminRouter.post("/verifyotp/:email", verifyOtp);
adminRouter.get("/admindashboard", adminOnly, admindashboard);

export default adminRouter;
