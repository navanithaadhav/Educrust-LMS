import mongoose from "mongoose";



const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, required: true },
  lectureOrder: { type: Number, required: true },
  lectureTitle: { type: String, required: true },
  lectureDuration: { type: String, required: true },
  lectureUrl: { type: String, required: false },
  publicId: { type: String, required: false }, // Cloudinary public_id
  isPreviewFree: { type: Boolean, required: true },
  lectureContent: { type: String, required: false },
  resourceType: { type: String, required: false, default: 'video' }, // 'video', 'doc', 'quiz'
  questions: [{
    questionId: { type: String },
    question: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: String }
  }],
  fileSize: { type: Number, required: false },
  uploadedBy: { type: String, required: false }, // User ID of uploader
}, { _id: false });


const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  chapterContent: [lectureSchema],
}, { _id: false });

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String, required: true },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    courseCategory: { type: String, required: false, default: 'Others' },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema],
    courseRatings: [
      { userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }
    ],
    educator: { type: String, ref: 'User', required: true },
    enrolledStudents: [{ type: String, ref: 'User' }],
  },
  { timestamps: true, minimize: false }
);


const Course = mongoose.model("Course", courseSchema);

export default Course;
