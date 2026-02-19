
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

async function findReactJs() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const course = await Course.findOne({ courseTitle: { $regex: /React Js/i } });
        if (course) {
            console.log('--- DETAILS ---');
            console.log('Title:', course.courseTitle);
            console.log('Educator:', course.educator);
            console.log('IsPublished:', course.isPublished);
            console.log('Id:', course._id);
        } else {
            console.log('NOT FOUND');
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findReactJs();
