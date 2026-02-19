import mongoose from 'mongoose';
import User from './models/user.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from current directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

const seedRevenue = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        let user = await User.findOne();

        if (!user) {
            console.log('No users found. Creating a dummy user...');
            const newUser = new User({
                _id: 'dummy_user_' + Date.now(),
                name: 'Dummy User',
                email: 'dummy' + Date.now() + '@example.com',
                password: 'password123',
                role: 'student',
                imageUrl: "https://via.placeholder.com/150"
            });
            await newUser.save();
            user = newUser;
            console.log('Dummy user created.');
        }

        const transaction = {
            transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
            courseId: 'dummy_course_id', // Fake ID is fine for User.transactions schema
            amount: 4999, // Dummy amount
            type: 'full',
            date: new Date()
        };

        // Use updateOne to bypass mongoose validation if needed, or just push.
        // But push should work if User schema allows it.
        // Let's use updateOne to be safe and avoid fetching/saving the whole document if unrelated validation fails.
        await User.updateOne(
            { _id: user._id },
            { $push: { transactions: transaction } }
        );

        console.log(`Added transaction of ₹${transaction.amount} to user ${user.email}`);

        process.exit(0);

    } catch (error) {
        console.error('Error seeding revenue:', error);
        process.exit(1);
    }
};

seedRevenue();
