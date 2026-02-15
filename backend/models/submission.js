import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    zipFile: {
      type: String, // file path
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    marks: {
      type: Number,
    },

    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);