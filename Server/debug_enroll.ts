
import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/user.js';
import Course from './models/course.js';

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(`${uri}/lms`);
        console.log('Connected');

        const course = await Course.findOne({});
        if (!course) { console.log('No courses'); return; }

        const user = await User.findOne({});
        if (!user) { console.log('No users'); return; }

        console.log(`User ID: ${user._id} (Type: ${typeof user._id})`);
        console.log(`Course ID: ${course._id}`);

        // Attempt Update
        await Course.findByIdAndUpdate(course._id, {
            $addToSet: { enrolledStudents: user._id }
        });

        const updated = await Course.findById(course._id);
        console.log('Updated Enrolled:', updated?.enrolledStudents);
        console.log('User ID in List?', updated?.enrolledStudents?.includes(user._id));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
run();
