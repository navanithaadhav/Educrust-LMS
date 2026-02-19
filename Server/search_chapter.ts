
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

async function findChapter() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const courses = await Course.find({}).lean();
        console.log('SEARCHING_FOR_CHAPTER');
        for (const c of courses) {
            if (c.courseContent) {
                for (const ch of c.courseContent) {
                    if (ch.chapterTitle && ch.chapterTitle.toLowerCase().includes('react installation')) {
                        console.log(`FOUND_CHAPTER|"${ch.chapterTitle}"|IN_COURSE|"${c.courseTitle}"`);
                    }
                }
            }
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findChapter();
