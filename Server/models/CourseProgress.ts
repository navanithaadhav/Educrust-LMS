
import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completedLectures: [{ type: String }], // Array of lectureIds
    lectureProgress: [{
        lectureId: String,
        viewed: Boolean,
        quizScore: Number
    }],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date }
}, { minimize: false, timestamps: true });

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
