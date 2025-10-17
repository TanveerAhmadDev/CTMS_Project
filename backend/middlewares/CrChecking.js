import jwt from "jsonwebtoken";
import userModel from "../models/User.model.js";

const CrChecking = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(403).json({ msg: "No Token is given" });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ msg: "User Not Founded" });
    }

    req.user = user;
    if (user.userRole == "Cr") {
      next();
    }
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default CrChecking;
