
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    educator: String,
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

async function findReactBeginners() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);

        const course = await Course.findOne({ courseTitle: "React JS for Beginners" }).lean();
        if (course) {
            console.log('--- React JS for Beginners DETAILS ---');
            console.log('ID:', course._id);
            console.log('Educator:', course.educator);
            console.log('Chapters:', course.courseContent.map(ch => ch.chapterTitle));
        } else {
            console.log('React JS for Beginners NOT FOUND');
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findReactBeginners();
