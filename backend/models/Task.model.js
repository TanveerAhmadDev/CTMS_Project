import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    sirName: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assginTime: {
      type: Date,
      default: Date.now,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    deadline: {
      type: String,
      default: Date.now,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const TaskModel = new mongoose.model("Task", taskSchema);

export default TaskModel;
