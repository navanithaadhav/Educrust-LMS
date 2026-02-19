
import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/user.js';
import Course from './models/course.js';

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI missing");

        await mongoose.connect(`${uri}/lms`);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking enrollments...`);

        let updatedCount = 0;

        for (const user of users) {
            if (user.enrolledCourses && user.enrolledCourses.length > 0) {
                console.log(`User ${user._id} has ${user.enrolledCourses.length} enrollments.`);
                for (const courseId of user.enrolledCourses) {
                    // Add user to course if not already there
                    const result = await Course.updateOne(
                        { _id: courseId },
                        { $addToSet: { enrolledStudents: user._id } }
                    );

                    if (result.matchedCount === 0) {
                        console.log(`  Failed to find course: ${courseId}`);
                    } else if (result.modifiedCount > 0) {
                        console.log(`  Synced User ${user._id} to Course ${courseId}`);
                        updatedCount++;
                    } else {
                        console.log(`  Already synced: User ${user._id} to Course ${courseId}`);
                    }
                }
            } else {
                console.log(`User ${user._id} has 0 enrollments.`);
            }
        }

        console.log(`Migration Complete. Updated ${updatedCount} course records.`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
run();
