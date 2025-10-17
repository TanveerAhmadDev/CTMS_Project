import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import adminRouter from "./Routes/Admin.Routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/User.Routes.js";
import sectionRouter from "./Routes/Section.Routes.js";
import cors from "cors";
import AuthRouter from "./Routes/auth.routes.js";
import taskRouter from "./Routes/Task.Routes.js";
dotenv.config({ path: "./config/.env" });
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      `${process.env.Frontend_Url}:5173`,
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

dbConnect();

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/section", sectionRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/task", taskRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on ${process.env.Frontend_Url}:${port}`);
});
