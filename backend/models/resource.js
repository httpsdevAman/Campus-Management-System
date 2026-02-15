import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    fileUrl: {
        type: String,
        required: true 
    },
    semester: Number,
}, { timestamps: true });

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;