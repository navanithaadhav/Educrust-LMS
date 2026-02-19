
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    educator: String,
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

async function findReactJs() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);

        const course = await Course.findOne({ courseTitle: "React Js" }).lean();
        if (course) {
            console.log('--- React Js DETAILS ---');
            console.log('ID:', course._id);
            console.log('Educator:', course.educator);
            console.log('Chapters:', course.courseContent.map(ch => ch.chapterTitle));
        } else {
            console.log('React Js NOT FOUND');
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findReactJs();
