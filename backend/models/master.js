import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const masterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
    },
    instituteEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@iitmandi\.ac\.in$/, "Use institute email"]
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'authority', 'admin'],
        default: 'student'
    },
    department: String
}, { timestamps: true });

const Master = mongoose.model("Master", masterSchema);
export default Master;
