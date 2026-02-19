import mongoose from 'mongoose';
import 'dotenv/config';

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI missing");

        console.log(`URI: ${uri.replace(/:([^@]+)@/, ':****@')}/lms`);

        await mongoose.connect(`${uri}/lms`);
        console.log('Connected to DB:', mongoose.connection.name);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const usersCount = await mongoose.connection.collection('users').countDocuments();
        console.log('Native Users Count:', usersCount);

        const coursesCount = await mongoose.connection.collection('courses').countDocuments();
        console.log('Native Courses Count:', coursesCount);

        if (usersCount > 0) {
            const user = await mongoose.connection.collection('users').findOne({});
            console.log('Sample User ID:', user?._id, 'Type:', user?._id?.constructor?.name);
        }
        if (coursesCount > 0) {
            const course = await mongoose.connection.collection('courses').findOne({});
            console.log('Sample Course ID:', course?._id, 'Type:', course?._id?.constructor?.name);
            console.log('Sample Course enrolledStudents:', course?.enrolledStudents);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
run();
