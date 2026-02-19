
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema);

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to DB');

        const courses = await Course.find({});
        console.log('Total Courses:', courses.length);
        courses.forEach(c => {
            console.log(`Title: ${c.courseTitle}, Educator: ${c.educator}, id: ${c._id}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkCourses();
