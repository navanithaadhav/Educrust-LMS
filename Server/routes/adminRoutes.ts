import express from 'express';
import { getDashboardData, getAllUsers, getAllCourses, deleteCourse, addUser, updateUserRole, updateCourse, adminEnrollUser, getAllReviews, deleteReview, updateReview, addCourse } from '../controllers/adminController.js';
import { uploadResource } from '../controllers/educatorController.js';
import { protectUser } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const adminRouter = express.Router();

// Middleware to check for admin role
const isAdmin = async (req: any, res: any, next: any) => {
    try {
        const User = (await import('../models/user.js')).default;
        const user = await User.findById(req.auth.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            return res.json({ success: false, message: 'Access Denied: Admins Only' });
        }
    } catch (error) {
        return res.json({ success: false, message: 'Auth Error' });
    }
}

adminRouter.get('/dashboard-stats', protectUser, isAdmin, getDashboardData);
adminRouter.get('/users', protectUser, isAdmin, getAllUsers);
adminRouter.post('/add-user', protectUser, isAdmin, addUser);
adminRouter.get('/courses', protectUser, isAdmin, getAllCourses);
adminRouter.post('/add-course', upload.single('image'), protectUser, isAdmin, addCourse);
adminRouter.delete('/delete-course/:id', protectUser, isAdmin, deleteCourse);
adminRouter.post('/edit-course/:id', upload.single('image'), protectUser, isAdmin, updateCourse);
adminRouter.put('/update-user-role', protectUser, isAdmin, updateUserRole);
adminRouter.post('/enroll-student', protectUser, isAdmin, adminEnrollUser);
adminRouter.post('/upload-resource', upload.single('file'), protectUser, isAdmin, uploadResource);
adminRouter.get('/reviews', protectUser, isAdmin, getAllReviews);
adminRouter.post('/delete-review', protectUser, isAdmin, deleteReview);
adminRouter.post('/update-review', protectUser, isAdmin, updateReview);

export default adminRouter;
