import mongoose from 'mongoose';
import User from './models/user.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log('No users found.');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Promoted user ${user.email} to admin.`);
        process.exit(0);

    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

makeAdmin();
