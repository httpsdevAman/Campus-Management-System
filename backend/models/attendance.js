import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }, 
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    attendance: [
        {
            date: { type: Date, required: true },
            present: { type: Boolean, required: true }
        }
    ],
    totalAttendance: { type: Number, default: 0 }
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;