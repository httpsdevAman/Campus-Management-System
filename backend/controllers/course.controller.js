import Course from "../models/course.js";
import Attendance from "../models/attendance.js";

export const getTotalCredits = async (req, res) => {
  try {
    const studentId = req.user._id; // from authMiddleware

    // Find all courses where student is enrolled
    const courses = await Course.find({
      students: studentId
    });

    // Calculate total credits
    const totalCredits = courses.reduce((sum, course) => {
      return sum + course.credits;
    }, 0);

    res.json({
      totalCourses: courses.length,
      totalCredits
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE COURSE (Faculty)
export const createCourse = async (req, res) => {
    try {
        const { courseCode, title, credits, semester, department, students } = req.body;

        const course = await Course.create({
            courseCode,
            title,
            credits,
            semester,
            department,
            instructor: req.user._id,
            students
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COURSES FOR STUDENT
export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ students: req.user._id })
            .populate("instructor", "name instituteEmail department employeeId")
            .populate("students", "name studentId instituteEmail");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET AVAILABLE COURSES (Student only: courses they are NOT enrolled in)
export const getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({
      students: { $ne: studentId }
    })
      .populate("instructor", "name instituteEmail department employeeId")
      .sort({ courseCode: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COURSES FOR FACULTY
export const getFacultyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .populate("instructor", "name instituteEmail department employeeId")
            .populate("students", "name studentId instituteEmail");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL COURSES (Admin only)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name instituteEmail department employeeId")
      .populate("students", "name studentId instituteEmail")
      .sort({ courseCode: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ENROLL STUDENT IN COURSE
export const enrollStudent = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id; // logged-in student

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add student
    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// STUDENT: Unenroll from a course
export const unenrollFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id; // logged-in student

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if student is actually enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: "You are not enrolled in this course" });
    }

    // Remove student from course
    course.students = course.students.filter(id => id.toString() !== studentId.toString());
    await course.save();

    // Optionally remove attendance records for this course
    await Attendance.deleteOne({ course: courseId, student: studentId });

    res.status(200).json({ message: "Successfully unenrolled from the course" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};