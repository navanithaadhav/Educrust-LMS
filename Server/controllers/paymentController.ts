import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";
import Course from "../models/course.js";

// Initialize Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export const splitAdminAmount = async (req: any, res: Response) => {
    // This is for admin specific logic if needed, skipping for now
}

// Create Razorpay Order
export const buyCourse = async (req: any, res: Response) => {
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.json({ success: false, message: 'User or Course not found' });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User already enrolled in this course' });
        }

        // Calculate Amount (Razorpay accepts amount in sub-units i.e. paise)
        let amount = (course.coursePrice - (course.discount * course.coursePrice) / 100);

        const { plan } = req.body;

        if (plan === 'full') {
            amount = amount * 0.98; // 2% extra discount
        } else if (plan === 'split') {
            amount = amount * 0.40; // 40% first installment
        }

        const options = {
            amount: Math.round(amount * 100), // convert to smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}_${userId.slice(-5)}`
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, order });

    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Payment and Enroll User
export const verifyPayment = async (req: any, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        const userId = req.auth.userId;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Signature Valid -> Enroll User
            const { plan } = req.body;
            const course = await Course.findById(courseId);
            let amount = (course!.coursePrice - (course!.discount * course!.coursePrice) / 100);
            if (plan === 'full') amount = amount * 0.98;
            else if (plan === 'split') amount = amount * 0.40;

            await User.findByIdAndUpdate(userId, {
                $addToSet: { enrolledCourses: courseId },
                $push: {
                    transactions: {
                        transactionId: razorpay_payment_id,
                        courseId: courseId,
                        amount: amount,
                        type: plan || 'full',
                        date: new Date()
                    }
                }
            });

            await Course.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId }
            });

            res.json({ success: true, message: 'Payment Verified and Course Purchased Successfully' });
        } else {
            res.json({ success: false, message: 'Invalid Signature' });
        }

    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}
