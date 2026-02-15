import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Internship", "Scholarship", "Hackathon", "Project"],
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Opportunity", opportunitySchema);