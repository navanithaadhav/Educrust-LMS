
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

async function listAllContent() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const courses = await Course.find({}).lean();
        console.log('--- ALL COURSES AND CHAPTERS ---');
        for (const c of courses) {
            console.log(`Course: "${c.courseTitle}"`);
            if (c.courseContent) {
                c.courseContent.forEach(ch => {
                    console.log(`  Chapter: "${ch.chapterTitle}"`);
                    if (ch.chapterContent) {
                        ch.chapterContent.forEach(lec => {
                            console.log(`    Lecture: "${lec.lectureTitle}"`);
                        });
                    }
                });
            }
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

listAllContent();
