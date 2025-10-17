import SectionModel from "../models/Section.model.js";
import TaskModel from "../models/Task.model.js";
import userModel from "../models/User.model.js";

export const createTask = async (req, res) => {
  try {
    const { taskTitle, sirName, subjectName, date, description } = req.body;

    if (!taskTitle || !sirName || !subjectName) {
      return res.status(500).json({ msg: "something is missing" });
    }

    let createdBy = await userModel.findById({ _id: req.user.id });

    let section = await SectionModel.findOne({ _id: req.user.section });

    if (!section) {
      return res.status(403).json({ msg: "Section Not found" });
    }

    const duplicateTask = await TaskModel.findOne({
      taskTitle,
      sectionId: section._id,
    });

    if (duplicateTask) {
      return res
        .status(409)
        .json({ msg: "Task already exists in this section." });
    }

    let task = await TaskModel.create({
      taskTitle,
      sirName,
      subjectName,
      createdBy: createdBy.id,
      sectionId: section.id,
      deadline: date,
      description,
    });

    if (!section.tasks.includes(task._id)) {
      section.tasks.push(task._id);
    }

    await section.save();

    // createdBy, sectionId;
    res.status(200).json({ msg: "Task Create" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    let task = await TaskModel.findOneAndDelete({ _id: id });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
