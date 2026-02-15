import Resource from "../models/resource.js";
import Course from "../models/course.js";
import fs from "fs";

// Upload Material
export const uploadResource = async (req, res) => {
  try {
    const { title, description, courseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
 
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const material = await Resource.create({
      title,
      description,
      course: courseId,
      semester: course.semester,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: "Material uploaded successfully",
      material
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  


// Get Materials By Course
export const getResourcesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let filter = { course: courseId };

    const materials = await Resource.find(filter)
      .populate("uploadedBy", "name instituteEmail")
      .populate("course", "title courseCode")
      .sort({ createdAt: -1 });

    res.status(200).json(materials);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Material
export const getSingleResource = async (req, res) => {
  try {
    const material = await Resource.findById(req.params.id)
      .populate("course", "name code")
      .populate("uploadedBy", "name instituteEmail");

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    

    res.status(200).json(material);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Material (Admin Only)
export const deleteResource = async (req, res) => {
  try {
    const material = await Resource.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Delete file from storage
    const filePath = `.${material.fileUrl}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await material.deleteOne();

    res.status(200).json({ message: "Material deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};