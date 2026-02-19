
import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/user.js';
import Course from './models/course.js';

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(`${uri}/lms`);

        // mimic finding educator
        const course = await Course.findOne({ enrolledStudents: { $not: { $size: 0 } } });
        if (!course) { console.log('No courses with students'); return; }

        const educatorId = course.educator;
        console.log(`Testing for Educator: ${educatorId}`);

        // Controller Logic
        const courses = await Course.find({ educator: educatorId });
        const studentIds = new Set<string>();
        courses.forEach(c => {
            if (c.enrolledStudents) {
                c.enrolledStudents.forEach((id: any) => studentIds.add(id.toString()));
            }
        });
        console.log(`Collected Student IDs: ${Array.from(studentIds).join(', ')}`);

        const students = await User.find({
            _id: { $in: Array.from(studentIds) }
        });
        console.log(`Students Fetched from DB: ${students.length}`);
        students.forEach(s => console.log(` - Found: ${s.name} (${s._id})`));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
run();
