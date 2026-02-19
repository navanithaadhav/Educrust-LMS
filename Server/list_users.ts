
import mongoose from 'mongoose';
import 'dotenv/config';

const User = mongoose.model('User', new mongoose.Schema({
    _id: String,
    name: String,
    role: String
}, { strict: false }));

async function listUsers() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const users = await User.find({}).lean();
        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`ID: "${u._id}", Name: "${u.name}", Role: "${u.role}"`);
        });
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

listUsers();
