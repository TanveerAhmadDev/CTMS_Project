import SectionModel from "../models/Section.model.js";
import userModel from "../models/User.model.js";

export const createsection = async (req, res) => {
  try {
    const { sectionName } = req.body;

    const sectionExists = await SectionModel.findOne({ sectionName });
    if (sectionExists) {
      return res.status(401).json({ msg: "Section already exists" });
    }

    const newSection = new SectionModel({
      sectionName,
    });

    await newSection.save();

    res.status(201).json({
      msg: "Section created successfully",
      section: newSection,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addstudent = async (req, res) => {
  try {
    const { sectionName, studentId } = req.body;

    // 1. Find the student by full name
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // 2. Check if student is already assigned to any section
    const alreadyAssigned = await SectionModel.findOne({ students: student._id });
    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ msg: "Student already has a section assigned" });
    }

    console.log("asd" + student);

    if (student._id == null) {
      console.log("as");
    }

    // 3. Find the section by name
    const section = await SectionModel.findOne({ sectionName: sectionName });
    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    // 4. Add the student to the section if not already added
    if (!section.students.includes(student._id)) {
      section.students.push(student._id);
    }

    // 5. Link the section to the student (if you’re storing it this way)
    student.section = section._id;

    // 6. Save changes
    await student.save();
    await section.save();

    // 7. Respond
    return res.status(201).json({
      msg: "Student successfully assigned to section",
      section,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllSections = async (req, res) => {
  try {
    let sections = await SectionModel.find();

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const findSectionById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({ msg: "Id is Undifined" });
    }

    let section = await SectionModel.find({ _id: id });

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const studentWithNoSection = async (req, res) => {
  try {
    let students = await userModel.find({ section: null }).select("-Password");

    if (students <= 0) {
      return res.status(403).json({ msg: "All Students have Section" });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
