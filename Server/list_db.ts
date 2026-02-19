
import mongoose from 'mongoose';
import 'dotenv/config';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

async function checkDB() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        console.log('Connected to DB');

        console.log('--- USERS ---');
        const users = await User.find({});
        users.forEach(u => {
            console.log(`Name: ${u.name}, ID: ${u._id}, Role: ${u.role}`);
        });

        console.log('--- COURSES ---');
        const courses = await Course.find({});
        courses.forEach(c => {
            console.log(`Title: ${c.courseTitle}, Educator: ${c.educator}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkDB();
