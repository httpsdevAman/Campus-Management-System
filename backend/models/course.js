import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
 
    title: {
        type: String, required: true
    },

    credits: {
        type: Number, required: true
    },

    semester: {
        type: Number, required: true
    },

    department: {
        type: String, required: true
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }] // enrolled students
    
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;