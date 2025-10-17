import adminModel from "../models/Admin.model.js";
import jwt from "jsonwebtoken";

const adminOnly = async (req, res, next) => {
  try {
    const token =
      req.cookies.adminToken 

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default adminOnly;
