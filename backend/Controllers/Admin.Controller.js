import bcrypt from "bcrypt";
import adminModel from "../models/Admin.model.js";
import jwt from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifyMail.js";
import sessionModel from "../models/Session.model.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";

export const adminregister = async (req, res) => {
  try {
    const existingAdmin = await adminModel.findOne();
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const { fullName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new adminModel({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    verifyMail(token, email);
    newAdmin.token = token;

    await newAdmin.save();

    res.cookie("adminToken", "as", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verification = async (req, res) => {
  try {
    let token = req.cookies.adminToken;

    console.log(token);

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ msg: "The registration Token is Expires" });
      }
      return res.status(400).json({ msg: "Token verfication failed" });
    }

    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ msg: "User not found" });
    }

    admin.token = null;
    admin.isVerified = true;

    await admin.save();

    return res.status(200).json({ msg: "Email Verfied" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.isVerified !== true) {
      return res.status(403).json({ msg: "Verify your account" });
    }

    const existingSession = await sessionModel.findOne({ adminId: admin._id });

    if (existingSession) {
      await sessionModel.deleteOne({ adminId: admin._id });
    }

    await sessionModel.create({ adminId: admin._id });

    let accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    let refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    admin.isLoggedIn = true;
    await admin.save();

    // let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    //   expiresIn: "10h",
    // });
    res.cookie("adminToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      msg: "Login successful",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const adminlogout = async (req, res) => {
  try {
    const adminId = req.adminId;

    await sessionModel.deleteMany({ adminId });
    await adminModel.findByIdAndUpdate(adminId, { isLoggedIn: false });

    return res.status(200).json({ msg: "admin logout" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(403).json({ msg: "Admin Not Found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    admin.otp = otp;
    admin.otpExpiry = expiry;

    await admin.save();

    await sendOtpMail(email, otp);
    return res.status(200).json({ msg: "Otp is Sended to Mail" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(400).json({ msg: "OTP is Required" });
  }

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(403).json({ msg: "Admin Not Found" });
    }

    if (!admin.otp || !admin.otpExpiry) {
      return res
        .status(403)
        .json({ msg: "OTP is not generated or already verified" });
    }

    if (admin.otpExpiry < new Date()) {
      return res
        .status(400)
        .json({ msg: "OTP is expired. Please request new OTP" });
    }
    if (otp !== admin.otp) {
      return res.status(400).json({ msg: "Invalid OTP " });
    }

    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    return res.status(200).json({ msg: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const admindashboard = async (req, res) => {
  try {
    let admin = req.admin;

    return res.status(200).json({ msg: "Welcome To admin Dashboard", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
