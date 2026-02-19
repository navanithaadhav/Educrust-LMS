
import { v2 as cloudinary } from 'cloudinary';
import Course from "../models/course.js";
import User from "../models/user.js";
import { Request, Response } from 'express';
import path from 'path';
import fs from "fs";

//update role to educator
export const updateRoleToEducator = async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.json({ success: false, message: 'Authentication required' });
        }

        await User.findByIdAndUpdate(userId, { role: 'educator' }, { new: true });

        return res.json({ success: true, message: 'Role updated to educator' });
    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
};


export const addCourse = async (req: any, res: Response) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId


        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        if (!imageFile && !parsedCourseData.courseThumbnail) {
            parsedCourseData.courseThumbnail = "https://placehold.co/600x400";
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', transformation: [{ width: 400, height: 250, crop: "fill" }] })
            parsedCourseData.courseThumbnail = imageUpload.secure_url
        }

        const newCourse = await Course.create(parsedCourseData)
        await newCourse.save()

        res.json({ success: true, message: 'Course Created Successfully', course: newCourse })
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}


// Upload Resource (Lecture File)
export const uploadResource = async (req: any, res: Response) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file provided" });
        }

        // With multer-storage-cloudinary, req.file.path is the secure_url
        // req.file.filename is the public_id
        console.log("Uploaded File:", req.file);

        res.json({
            success: true,
            url: req.file.path,
            publicId: req.file.filename,
            resourceType: req.file.mimetype.split('/')[0]
        });

    } catch (error: any) {
        console.log("Upload error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Lecture
export const deleteLecture = async (req: any, res: Response) => {
    try {
        const { courseId, chapterId, lectureId } = req.body;
        const educatorId = req.auth.userId;

        const course = await Course.findOne({ _id: courseId, educator: educatorId });
        if (!course) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
        }

        const chapter = course.courseContent.find((ch: any) => ch.chapterId === chapterId);
        if (!chapter) {
            return res.json({ success: false, message: 'Chapter not found' });
        }

        const lectureIndex = chapter.chapterContent.findIndex((l: any) => l.lectureId === lectureId);
        if (lectureIndex === -1) {
            return res.json({ success: false, message: 'Lecture not found' });
        }

        const lecture = chapter.chapterContent[lectureIndex];

        // Delete from Cloudinary if publicId exists
        if (lecture.publicId) {
            const resourceType = lecture.resourceType === 'video' ? 'video' : 'raw'; // or image
            await cloudinary.uploader.destroy(lecture.publicId, { resource_type: resourceType });
        } else if (lecture.lectureUrl) {
            // Try to extract public_id if not saved explicitly (backward compatibility)
            // This is risky, better to rely on publicId being saved in new uploads
        }

        // Remove lecture from array
        chapter.chapterContent.splice(lectureIndex, 1);

        await course.save();

        res.json({ success: true, message: 'Lecture deleted successfully' });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Add Lecture (Granular)
export const addLecture = async (req: any, res: Response) => {
    try {
        const { courseId, chapterId, lectureData } = req.body; // lectureData contains url, publicId, etc.
        const educatorId = req.auth.userId;

        const course = await Course.findOne({ _id: courseId, educator: educatorId });
        if (!course) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
        }

        const chapter = course.courseContent.find((ch: any) => ch.chapterId === chapterId);
        if (!chapter) {
            return res.json({ success: false, message: 'Chapter not found' });
        }

        chapter.chapterContent.push(lectureData);
        await course.save();

        res.json({ success: true, message: 'Lecture added successfully', course });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}


export const getEducatorCourses = async (req: any, res: Response) => {
    try {
        const educatorId = req.auth.userId
        const courses = await Course.find({ educator: educatorId })
        console.log(`[getEducatorCourses] Educator: ${educatorId}, Found: ${courses.length}`);
        res.json({ success: true, courses })
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

// Delete Course
export const deleteCourse = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const educatorId = req.auth.userId;

        const course = await Course.findOne({ _id: id, educator: educatorId });

        if (!course) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
        }

        await Course.findByIdAndDelete(id);

        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

// Update Course
export const updateCourse = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        const course = await Course.findOne({ _id: id, educator: educatorId });

        if (!course) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
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

export const getEnrolledStudentsData = async (req: any, res: Response) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });

        // Collect all unique student IDs from the courses
        const studentIds = new Set<string>();
        courses.forEach(course => {
            if (course.enrolledStudents && course.enrolledStudents.length > 0) {
                course.enrolledStudents.forEach((id: any) => studentIds.add(id.toString()));
            }
        });

        console.log(`[getEnrolledStudentsData] EducatorID: ${educatorId}`);
        console.log(`[getEnrolledStudentsData] Courses Found: ${courses.length}`);
        console.log(`[getEnrolledStudentsData] Student IDs from Courses: ${Array.from(studentIds).join(', ')}`);

        // Fetch students
        const students = await User.find({
            _id: { $in: Array.from(studentIds) }
        });

        console.log(`[getEnrolledStudentsData] Students Fetched from DB: ${students.length}`);

        const enrolledStudents: any[] = [];

        // Map courses to their students
        courses.forEach(course => {
            if (course.enrolledStudents && course.enrolledStudents.length > 0) {
                course.enrolledStudents.forEach((studentId: any) => {
                    const student = students.find(s => s._id.toString() === studentId.toString());
                    if (student) {
                        enrolledStudents.push({
                            student: {
                                _id: student._id,
                                name: student.name,
                                imageUrl: student.imageUrl
                            },
                            courseTitle: course.courseTitle,
                            purchaseDate: new Date() // No date tracked in this schema
                        });
                    }
                });
            }
        });

        res.json({ success: true, enrolledStudents });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const educatorEnrollUser = async (req: any, res: Response) => {
    try {
        const { email, courseId } = req.body;
        const educatorId = req.auth.userId;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Ensure educator owns the course
        if (String(course.educator) !== String(educatorId)) {
            return res.json({ success: false, message: 'You can only enroll students in your own courses' });
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

        res.json({ success: true, message: 'Student enrolled successfully' });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const educatorDashboardData = async (req: any, res: Response) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });
        console.log(`[educatorDashboardData] Educator: ${educatorId}, Found: ${courses.length}`);
        const totalCourses = courses.length;

        // Calculate Total Earnings and Enrollments
        let totalEarnings = 0;
        let totalEnrollments = 0;
        const studentIds = new Set<string>();

        courses.forEach(course => {
            const count = course.enrolledStudents ? course.enrolledStudents.length : 0;
            totalEarnings += (course.coursePrice - (course.discount * course.coursePrice) / 100) * count;
            totalEnrollments += count;

            if (course.enrolledStudents) {
                course.enrolledStudents.forEach((id: any) => studentIds.add(id.toString()));
            }
        });

        // Fetch students for "Latest Enrollments"
        const students = await User.find({
            _id: { $in: Array.from(studentIds) }
        });

        const enrolledStudentsData: any[] = [];
        courses.forEach(course => {
            if (course.enrolledStudents) {
                course.enrolledStudents.forEach((studentId: any) => {
                    const student = students.find(s => s._id.toString() === studentId.toString());
                    if (student) {
                        enrolledStudentsData.push({
                            student: {
                                _id: student._id,
                                name: student.name,
                                imageUrl: student.imageUrl
                            },
                            courseTitle: course.courseTitle,
                            // No enrollment date stored
                        });
                    }
                });
            }
        });

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                totalEnrollments,
                totalCourses,
                enrolledStudentsData: enrolledStudentsData.reverse()
            }
        });

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}