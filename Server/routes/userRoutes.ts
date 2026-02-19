import express from 'express';
import { getUserData, userEnrolledCourses, updateUserCourseProgress, getUserCourseProgress } from '../controllers/userController.js';
import { buyCourse, verifyPayment } from '../controllers/paymentController.js';
import { protectUser } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/data', protectUser, getUserData);
userRouter.post('/purchase', protectUser, buyCourse);
userRouter.post('/verify-payment', protectUser, verifyPayment);
userRouter.get('/enrolled-courses', protectUser, userEnrolledCourses);
userRouter.post('/update-course-progress', protectUser, updateUserCourseProgress);
userRouter.post('/get-course-progress', protectUser, getUserCourseProgress);

export default userRouter;
