import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ["Infrastructure", "Academic", "Hostel", "Other", "IT", "Mess"],
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Low"
    },

    location: String,

    isAnonymous: {
        type: Boolean,
        default: false
    },

    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    status: {
        type: String,
        enum: ["Submitted", "Under Review", "In Progress", "Resolved", "Closed"],
        default: "Submitted"
    },

    remarks: [
        {
            remark: String,
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true });

export default mongoose.model("Grievance", grievanceSchema);