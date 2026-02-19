
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    educator: String,
    courseTitle: String
}, { strict: false }));

async function countCourses() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const count = await Course.countDocuments({});
        console.log('TOTAL_COURSES:', count);

        const educatorId = 'mjmrdz583id2wqwqobx';
        const eduCount = await Course.countDocuments({ educator: educatorId });
        console.log('COURSES_FOR_EDUCATOR:', eduCount);

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

countCourses();
