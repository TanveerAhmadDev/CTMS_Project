import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      // required: true,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    Registration_NO: {
      type: String,
      unique: true,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ["Student", "Cr"],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", UserSchema);

export default userModel;
