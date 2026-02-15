import Assignment from "../models/assignment.js";

export const createAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const { title, description, course, dueDate } = req.body;

    const assignment = await Assignment.create({
      title: title || "Untitled",
      description: description || "",
      course,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      uploadedBy: req.user._id || req.user.id,
      pdfFile: `/uploads/assignments/${req.file.filename}`,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET assignments by course (for course detail view)
export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId })
      .populate("uploadedBy", "name instituteEmail")
      .sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};