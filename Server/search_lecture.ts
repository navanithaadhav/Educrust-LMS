
import mongoose from 'mongoose';
import 'dotenv/config';

const Course = mongoose.model('Course', new mongoose.Schema({
    courseTitle: String,
    courseContent: Array
}, { strict: false }));

async function findLecture() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const courses = await Course.find({}).lean();
        console.log('SEARCHING_FOR_LECTURE');
        for (const c of courses) {
            if (c.courseContent) {
                for (const ch of c.courseContent) {
                    if (ch.chapterContent) {
                        for (const lec of ch.chapterContent) {
                            if (lec.lectureTitle && lec.lectureTitle.toLowerCase().includes('react installation')) {
                                console.log(`FOUND_LECTURE|"${lec.lectureTitle}"|IN_CHAPTER|"${ch.chapterTitle}"|IN_COURSE|"${c.courseTitle}"`);
                            }
                        }
                    }
                }
            }
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findLecture();
