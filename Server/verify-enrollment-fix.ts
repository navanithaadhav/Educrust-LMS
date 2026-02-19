
import mongoose from 'mongoose';
import User from './models/user.js'; // Adjust path if needed (might need ts-node or run compiled)
import Course from './models/course.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/lms');
        console.log('DB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const verify = async () => {
    await connectDB();

    try {
        // 1. Find a student
        const user = await User.findOne({ role: 'student' });
        if (!user) {
            console.log('No student found');
            return;
        }
        console.log('User found:', user.email, user._id);

        // 2. Find a course
        const course = await Course.findOne({});
        if (!course) {
            console.log('No course found');
            return;
        }
        console.log('Course found:', course.courseTitle, course._id);

        // 3. Enroll logic (simulate Admin)
        const courseIdStr = course._id.toString();
        const userIdStr = user._id.toString();

        console.log('Enrolling...');

        // Add to User
        await User.findByIdAndUpdate(user._id, {
            $addToSet: { enrolledCourses: courseIdStr }
        });

        // Add to Course
        await Course.findByIdAndUpdate(course._id, {
            $addToSet: { enrolledStudents: userIdStr }
        });

        console.log('Enrolled. Fetching populated user...');

        // 4. Verification
        const refreshedUser = await User.findById(user._id).populate('enrolledCourses');
        console.log('Refreshed User Enrolled Courses:', refreshedUser?.enrolledCourses);

        if (refreshedUser?.enrolledCourses.some((c: any) => c._id.toString() === courseIdStr)) {
            console.log('SUCCESS: Course is populated!');
        } else {
            console.log('FAILURE: Course ID is in array but not populated?');
            console.log('Raw EnrolledCourses:', refreshedUser?.enrolledCourses);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

verify();
