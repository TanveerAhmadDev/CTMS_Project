import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const sessionModel = new mongoose.model("Session", SessionSchema);

export default sessionModel;
