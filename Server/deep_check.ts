
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    educator: String,
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

const User = mongoose.model('User', new mongoose.Schema({
    _id: String,
    name: String
}, { strict: false }));

async function deepCheck() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);

        console.log('--- ALL COURSES ---');
        const courses = await Course.find({}).lean();
        for (const c of courses) {
            const edu = await User.findOne({ _id: c.educator }).lean();
            console.log(`- Title: "${c.courseTitle}" | EducatorID: ${c.educator} (${edu ? edu.name : 'User Not Found'})`);
            if (c.courseContent && Array.isArray(c.courseContent)) {
                console.log(`  Chapters: ${c.courseContent.map(ch => ch.chapterTitle).join(', ')}`);
            }
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

deepCheck();
