import Submission from "../models/submission.js";
import Assignment from "../models/assignment.js";
import Course from "../models/course.js";

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const studentId = req.user._id;

        // Check assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check due date
        if (new Date() > assignment.dueDate) {
            return res.status(400).json({ message: "Submission deadline passed" });
        }

        // Check enrollment (handle ObjectId vs string comparison)
        const course = await Course.findById(assignment.course);
        const isEnrolled = course.students.some(
            (s) => s && s.toString() === studentId.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({
                message: "You are not enrolled in this course",
            });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                message: "No file uploaded. Please attach a PDF or ZIP file.",
            });
        }

        // Check existing submission
        let existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: studentId,
        });

        // RESUBMISSION LOGIC
        if (existingSubmission) {
            existingSubmission.zipFile = req.file.path;
            existingSubmission.submittedAt = new Date();
            await existingSubmission.save();

            return res.status(200).json({
                message: "Assignment resubmitted successfully",
                submission: existingSubmission,
            });
        }

        // First submission
        const submission = await Submission.create({
            assignment: assignmentId,
            student: studentId,
            zipFile: req.file.path,
        });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submission,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const facultyId = req.user.id;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const course = await Course.findById(assignment.course);

        // Check if faculty owns the course
        if (course.instructor.toString() !== facultyId) {
            return res.status(403).json({
                message: "You are not authorized to view these submissions",
            });
        }

        const submissions = await Submission.find({
            assignment: assignmentId,
        })
            .populate("student", "name instituteEmail")
            .sort({ createdAt: -1 });

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMySubmissions = async (req, res) => {
    try {
        const studentId = req.user._id;

        const submissions = await Submission.find({ student: studentId })
            .populate({
                path: "assignment",
                populate: { path: "course", select: "courseCode title" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};