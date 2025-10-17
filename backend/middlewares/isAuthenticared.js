import jwt from "jsonwebtoken";
import adminModel from "../models/Admin.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Access token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({ msg: "Access Token is expired" });
        }
        return res
          .status(403)
          .json({ msg: "Access Token is invalid or missing" });
      }

      const { id } = decoded;

      const admin = await adminModel.findById(id);

      if (!admin) {
        return res.status(403).json({ msg: "Admin Not Found" });
      }

      req.adminId = admin._id;
      next();
    });
  } catch (error) {}
};
