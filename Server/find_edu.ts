
import mongoose from 'mongoose';
import 'dotenv/config';

const User = mongoose.model('User', new mongoose.Schema({
    _id: String,
    name: String,
    role: String
}, { strict: false }));

async function findEducator() {
    try {
        const uri = `${process.env.MONGODB_URI}/lms`;
        await mongoose.connect(uri);
        const users = await User.find({ role: 'educator' }).lean();
        users.forEach(u => {
            console.log(`ID: [${u._id}], Name: [${u.name}]`);
        });
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

findEducator();
