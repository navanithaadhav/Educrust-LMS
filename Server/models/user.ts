import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetOtp: { type: String, default: '' },
        resetOtpExpire: { type: Number, default: 0 },
        imageUrl: { type: String, default: "" },
        role: { type: String, default: 'student' },
        verificationOtp: { type: String, default: '' },
        verificationOtpExpire: { type: Number, default: 0 },
        isAccountVerified: { type: Boolean, default: false },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        transactions: [
            {
                transactionId: { type: String },
                courseId: { type: String, ref: 'Course' },
                amount: { type: Number },
                type: { type: String, enum: ['full', 'split'] },
                date: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }

);

const User = mongoose.model('User', userSchema);
export default User;