import Attendance from "../models/attendance.js";
import Course from "../models/course.js";

// FACULTY: Mark attendance for a course
export const markAttendance = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { date, presentStudents } = req.body; // presentStudents = array of student IDs

        const course = await Course.findById(courseId).populate("students");
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Only instructor can mark attendance
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not the instructor of this course" });
        }

        // Loop through enrolled students
        for (let student of course.students) {
            // Check if student has attendance document for this course
            let attendanceDoc = await Attendance.findOne({ course: courseId, student: student._id });

            if (!attendanceDoc) {
                // Create new attendance document
                attendanceDoc = new Attendance({
                    course: courseId,
                    student: student._id,
                    attendance: [],
                    totalAttendance: 0
                });
            }

            // Check if this date already exists
            const alreadyMarked = attendanceDoc.attendance.some(a => a.date.toISOString() === new Date(date).toISOString());
            if (alreadyMarked) continue;

            // Mark present or absent
            const isPresent = presentStudents.includes(student._id.toString());
            attendanceDoc.attendance.push({ date, present: isPresent });

            if (isPresent) attendanceDoc.totalAttendance += 1;

            await attendanceDoc.save();
        }

        res.status(201).json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// STUDENT: Get attendance for a course
export const getMyAttendance = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const attendanceDoc = await Attendance.findOne({
            course: courseId,
            student: req.user._id
        });

        if (!attendanceDoc) {
            return res.status(404).json({ message: "No attendance found" });
        }

        const totalClasses = attendanceDoc.attendance.length;
        const attendedClasses = attendanceDoc.totalAttendance;

        const percentage =
            totalClasses === 0
                ? 0
                : ((attendedClasses / totalClasses) * 100).toFixed(2);

        const warning = percentage < 75;

        res.status(200).json({
            totalClasses,
            attendedClasses,
            percentage: `${percentage}%`,
            warning: warning
                ? "⚠ Attendance below 75%"
                : "✅ Attendance above 75%",
            attendance: attendanceDoc.attendance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FACULTY: Get attendance report for all students in a course
// export const getCourseAttendance = async (req, res) => {
//   try {
//     const courseId = req.params.courseId;

//     const course = await Course.findById(courseId).populate("students", "name studentId instituteEmail");
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     // Only instructor can see full report
//     if (course.instructor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "You are not the instructor of this course" });
//     }

//     const attendanceRecords = await Attendance.find({ course: courseId })
//       .populate("student", "name studentId instituteEmail");

//     res.status(200).json(attendanceRecords);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };