import User from "../models/user.js";
import Course from "../models/course.js";
import CourseProgress from "../models/CourseProgress.js";
import { Request, Response } from "express";

export const getUserData = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        if (!userId) {
            return res.json({ success: false, message: "Not Authenticated" });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.imageUrl === "https://i.ibb.co/6r4Jj70/user.png") {
            user.imageUrl = "";
        }

        res.json({ success: true, userData: user });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const purchaseCourse = async (req: any, res: Response) => {
    try {
        const { courseId } = req.body
        const { userId } = req.auth
        const user = await User.findById(userId)
        const course = await Course.findById(courseId)

        if (!user || !course) {
            return res.json({ success: false, message: 'User or Course not found' })
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User already enrolled in this course' })
        }

        await User.findByIdAndUpdate(userId, {
            $push: { enrolledCourses: courseId }
        })

        await Course.findByIdAndUpdate(courseId, {
            $push: { enrolledStudents: userId }
        })

        res.json({ success: true, message: 'Course Purchased Successfully' })

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const userEnrolledCourses = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId).populate('enrolledCourses')
        if (user) {
            console.log(`[User Enrolled] Fetching for user ${userId}. Found ${user.enrolledCourses.length} courses.`);
            res.json({ success: true, enrolledCourses: user.enrolledCourses })
        } else {
            res.json({ success: false, message: 'User not found' })
        }

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}


export const updateUserCourseProgress = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body;
        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.completedLectures.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' });
            }
            progressData.completedLectures.push(lectureId);
        } else {
            progressData = new CourseProgress({
                userId,
                courseId,
                completedLectures: [lectureId]
            });
        }

        const course = await Course.findById(courseId);
        if (course) {
            const totalLectures = course.courseContent.reduce((acc: number, chapter: any) => acc + chapter.chapterContent.length, 0);
            if (progressData.completedLectures.length >= totalLectures) {
                progressData.isCompleted = true;
                progressData.completedAt = new Date();
            }
        }

        await progressData.save();
        res.json({ success: true, message: 'Course Progress Updated' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserCourseProgress = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const requestCertificate = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;

        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (!progressData) {
            return res.json({ success: false, message: "Course progress not found" });
        }

        if (progressData.certificateStatus === 'requested') {
            return res.json({ success: false, message: "Certificate already requested" });
        }
        if (progressData.certificateStatus === 'approved') {
            return res.json({ success: false, message: "Certificate already approved" });
        }
        if (progressData.certificateStatus === 'downloaded') {
            return res.json({ success: false, message: "Certificate already downloaded" });
        }

        progressData.certificateStatus = 'requested';
        await progressData.save();

        res.json({ success: true, message: 'Certificate requested successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const markCertificateDownloaded = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;

        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (!progressData) {
            return res.json({ success: false, message: "Course progress not found" });
        }

        if (progressData.certificateStatus !== 'approved') {
            return res.json({ success: false, message: "Certificate not approved for download or already downloaded" });
        }

        progressData.certificateStatus = 'downloaded';
        await progressData.save();

        res.json({ success: true, message: 'Certificate marked as downloaded' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}
