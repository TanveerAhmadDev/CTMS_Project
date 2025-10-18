import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/Admin.model.js";
import userModel from "../models/User.model.js";
import sessionModel from "../models/Session.model.js";

export const universalLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const admin = await adminModel.findOne({ email: identifier });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!admin.isVerified) {
        return res.status(403).json({ message: "Verify your account" });
      }

      const existingSession = await sessionModel.findOne({
        adminId: admin._id,
      });
      if (existingSession) {
        await sessionModel.deleteOne({ adminId: admin._id });
      }

      await sessionModel.create({ adminId: admin._id });

      const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });

      return res.status(200).json({
        token: accessToken, // <== include the token here
        role: "admin",
        message: "Login successful",
        redirectUrl: "/dashboard",
        admin: {
          name: admin.name,
          email: admin.email,
        },
      });
    }

    // If not admin, try user
    const user = await userModel.findOne({ Registration_NO: identifier });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "50m",
    });

    let redirectUrl = "/";
    if (user.userRole === "Student") {
      redirectUrl = "/student/dashboard";
    } else if (user.userRole === "Cr") {
      redirectUrl = "/cr/dashboard";
    }

    return res.status(200).json({
      token, // include token here
      role: "user",
      message: "Login successful",
      redirectUrl,
      user: {
        fullName: user.fullName,
        Registration_NO: user.Registration_NO,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const UserData = async (req, res) => {
  try {
    const adminToken = req.cookies.adminToken;
    const userToken = req.cookies.userToken;

    if (adminToken) {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      const admin = await adminModel.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({
        role: "admin",
        admin: {
          name: admin.fullName,
          email: admin.email,
          isVerified: admin.isVerified,
        },
      });
    }

    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      const user = await userModel
        .findById(decoded.id)
        .select("-Password")
        .populate({
          path: "section",
          select: "sectionName tasks students",
          populate: [
            {
              path: "tasks",
              select:
                "taskTitle sirName assginTime createdBy deadline description",
              populate: {
                path: "createdBy",
                select: "userRole fullName",
              },
            },
            {
              path: "students",
              select: "fullName userRole",
            },
          ],
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        role: "user",
        user: {
          userId: user.id,
          name: user.fullName,
          Registration_NO: user.Registration_NO,
          userRole: user.userRole,
          email: user.email,
          section: user.section,
        },
      });
    }

    return res.status(401).json({ msg: "Unautorized" });
  } catch (error) {
    console.error("UserData Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: true, // MUST be true in production (HTTPS only)
    sameSite: "None", // Must match the setting used when you set the cookie
  });

  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true, // MUST be true in production (HTTPS only)
    sameSite: "None",
  });

  res.json({ message: "Logged out successfully" });
};
