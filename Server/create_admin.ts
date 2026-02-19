import mongoose from 'mongoose';
import User from './models/user.js';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const email = 'admin@educrust.com';
        const password = 'password123';

        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user already exists. Updating role to admin just in case.');
            user.role = 'admin';
            // Reset password to be sure
            user.password = await bcrypt.hash(password, 10);
            await user.save();
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                _id: 'admin_' + Date.now(),
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
                imageUrl: "https://via.placeholder.com/150"
            });
            await user.save();
        }

        console.log(`Admin user ready: ${email} / ${password}`);
        process.exit(0);

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
