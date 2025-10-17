import express from "express";
import {
  logout,
  universalLogin,
  UserData,
} from "../Controllers/auht.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/login", universalLogin);
AuthRouter.get("/userdata", UserData);
AuthRouter.post("/logout", logout);

export default AuthRouter;
