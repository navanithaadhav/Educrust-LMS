import User from "../models/user.js";
import Course from "../models/course.js";
import CourseProgress from "../models/CourseProgress.js";
import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();

        const revenue = await User.aggregate([
            { $unwind: "$transactions" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$transactions.amount" }
                }
            }
        ]);
        const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        // Mock sales data for the chart (since we don't have a Sales model yet)
        const salesData = [
            { name: 'Week 1', sales: 4000 },
            { name: 'Week 2', sales: 3000 },
            { name: 'Week 3', sales: 5000 },
            { name: 'Week 4', sales: 4500 },
        ];

        // Most popular courses (top 5 by enrollment)
        const mostPopularCourses = await Course.aggregate([
            {
                $project: {
                    courseTitle: 1,
                    enrolledCount: { $size: "$enrolledStudents" },
                    coursePrice: 1
                }
            },
            { $sort: { enrolledCount: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                totalRevenue,
            },
            recentUsers,
            salesData,
            mostPopularCourses
        });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find().populate('educator', 'name');
        res.json({ success: true, courses });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}


export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const addUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please provide name, email, and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User with this email already exists' });
        }

        const bcrypt = (await import('bcryptjs')).default;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            imageUrl: "https://i.ibb.co/6r4Jj70/user.png",
            enrolledCourses: []
        });

        await newUser.save();

        res.json({ success: true, message: 'User added successfully', user: newUser });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { userId, role } = req.body;

        if (!['student', 'educator', 'admin'].includes(role)) {
            return res.json({ success: false, message: 'Invalid role provided' });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User role updated successfully', user });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}



// Add Course (Admin)
export const addCourse = async (req: any, res: Response) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const adminId = req.auth.userId;

        const parsedCourseData = await JSON.parse(courseData);

        // If educator is not provided in courseData, default to the admin (though UI should likely enforce it or default to admin)
        if (!parsedCourseData.educator) {
            parsedCourseData.educator = adminId;
        }

        if (!imageFile && !parsedCourseData.courseThumbnail) {
            parsedCourseData.courseThumbnail = "https://placehold.co/600x400";
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', transformation: [{ width: 400, height: 250, crop: "fill" }] });
            parsedCourseData.courseThumbnail = imageUpload.secure_url;
        }

        const newCourse = await Course.create(parsedCourseData);
        await newCourse.save();

        res.json({ success: true, message: 'Course Added Successfully', course: newCourse });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Update Course (Admin)
export const updateCourse = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { courseData } = req.body;
        const imageFile = req.file;

        const course = await Course.findById(id);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        const parsedCourseData = await JSON.parse(courseData);

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', transformation: [{ width: 400, height: 250, crop: "fill" }] });
            parsedCourseData.courseThumbnail = imageUpload.secure_url;
        }

        await Course.findByIdAndUpdate(id, parsedCourseData, { new: true });

        res.json({ success: true, message: 'Course updated successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}
// Enroll User (Admin)
export const adminEnrollUser = async (req: any, res: Response) => {
    try {
        const { email, courseId } = req.body;

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') }
        });

        if (!user) {
            return res.json({ success: false, message: 'User not found. Please ensure the student has registered an account first.' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User already enrolled in this course' });
        }

        await User.findByIdAndUpdate(user._id, {
            $addToSet: { enrolledCourses: courseId }
        });

        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: user._id }
        });

        console.log(`[Admin Enroll] Successfully enrolled user ${user.email} (${user._id}) in course ${course.courseTitle} (${course._id})`);
        res.json({ success: true, message: 'Student enrolled successfully' });

    } catch (error: any) {
        console.error("Error in adminEnrollUser:", error);
        res.json({ success: false, message: error.message });
    }
}

// Get All Reviews (Ratings)
export const getAllReviews = async (req: any, res: Response) => {
    try {
        const courses = await Course.find({});
        let allReviews: any[] = [];

        await Promise.all(courses.map(async (course) => {
            if (course.courseRatings && course.courseRatings.length > 0) {
                await Promise.all(course.courseRatings.map(async (rating: any) => {
                    const user = await User.findById(rating.userId);
                    allReviews.push({
                        courseId: course._id,
                        courseTitle: course.courseTitle,
                        user: {
                            _id: rating.userId,
                            name: user ? user.name : "Unknown User",
                            imageUrl: user ? user.imageUrl : "https://via.placeholder.com/30"
                        },
                        rating: rating.rating,
                        _id: rating._id // Mongoose subdocument ID
                    });
                }));
            }
        }));

        res.json({ success: true, reviews: allReviews });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Review
export const deleteReview = async (req: any, res: Response) => {
    try {
        const { courseId, userId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        await Course.findByIdAndUpdate(courseId, {
            $pull: { courseRatings: { userId: userId } }
        });

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Update Review
export const updateReview = async (req: any, res: Response) => {
    try {
        const { courseId, userId, rating } = req.body;

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        await Course.updateOne(
            { _id: courseId, "courseRatings.userId": userId },
            { $set: { "courseRatings.$.rating": rating } }
        );

        res.json({ success: true, message: 'Review updated successfully' });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Certificate Requests
export const getCertificateRequests = async (req: Request, res: Response) => {
    try {
        const requests = await CourseProgress.find({ certificateStatus: 'requested' });

        const formattedRequests = await Promise.all(requests.map(async (reqst) => {
            const user = await User.findById(reqst.userId).select('name email imageUrl');
            const course = await Course.findById(reqst.courseId).select('courseTitle');
            return {
                _id: reqst._id,
                userId: reqst.userId,
                courseId: reqst.courseId,
                userName: user ? user.name : 'Unknown',
                userEmail: user ? user.email : 'Unknown',
                userImage: user ? user.imageUrl : '',
                courseTitle: course ? course.courseTitle : 'Unknown',
                requestedAt: (reqst as any).updatedAt,
                status: reqst.certificateStatus
            };
        }));

        res.json({ success: true, requests: formattedRequests });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Update Certificate Status (Approve/Reject)
export const updateCertificateStatus = async (req: Request, res: Response) => {
    try {
        const { progressId, status } = req.body;

        if (!['approved', 'none', 'requested'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }

        const progress = await CourseProgress.findByIdAndUpdate(progressId, { certificateStatus: status }, { new: true });

        if (!progress) {
            return res.json({ success: false, message: 'Progress record not found' });
        }

        res.json({ success: true, message: `Certificate ${status === 'approved' ? 'approved' : 'rejected'} successfully` });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

