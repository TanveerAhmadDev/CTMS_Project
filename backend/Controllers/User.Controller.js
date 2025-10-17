import userModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const usersignup = async (req, res) => {
  try {
    const { Registration_NO, Password, userRole } = req.body;

    let Registration_NOChecking = await userModel.findOne({ Registration_NO });

    if (Registration_NOChecking) {
      return res.status(401).json({ msg: "User Already Exist" });
    }

    let hashedpassword = await bcrypt.hash(Password, 10);

    let newUser = new userModel({
      Registration_NO,
      Password: hashedpassword,
      userRole,
    });

    await newUser.save();

    res.status(200).json({ msg: "user Created" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { Registration_NO, Password } = req.body;

    const user = await userModel.findOne({ Registration_NO });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    let redirectUrl;
    if (user.userRole === "Student") {
      redirectUrl = "/student/dashboard";
    } else if (user.userRole === "Cr") {
      redirectUrl = "/cr/dashboard";
    } else {
      redirectUrl = "/";
    }
    res.status(200).json({
      message: "Login successful",
      redirectUrl,
      user: {
        fullName: user.fullName,
        Registration_NO: user.Registration_NO,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    const { email, name } = req.body;

    console.log(email);
    console.log(name);

    let user = await userModel.findByIdAndUpdate(
      id,
      { fullName: name, email: email },
      { new: true }
    );
    
    


    console.log(user);

    res.status(200).json({ msg: "Profile Updated " });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
