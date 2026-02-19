import express from 'express';
import { addCourse, updateRoleToEducator, getEducatorCourses, deleteCourse, updateCourse, getEnrolledStudentsData, educatorEnrollUser, educatorDashboardData, uploadResource, deleteLecture, addLecture } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import uploadCloudinary from '../configs/multer-cloudinary.js';
import { protectEducator, protectUser } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get('/update-role', protectUser, updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectUser, protectEducator, addCourse)
educatorRouter.get('/courses', protectUser, protectEducator, getEducatorCourses)
educatorRouter.delete('/delete-course/:id', protectUser, protectEducator, deleteCourse)
educatorRouter.post('/edit-course/:id', upload.single('image'), protectUser, protectEducator, updateCourse)
educatorRouter.post('/upload-resource', uploadCloudinary.single('file'), protectUser, protectEducator, uploadResource)
educatorRouter.post('/delete-lecture', protectUser, protectEducator, deleteLecture)
educatorRouter.post('/add-lecture', protectUser, protectEducator, addLecture)
educatorRouter.get('/enrolled-students', protectUser, protectEducator, getEnrolledStudentsData)
educatorRouter.post('/enroll-student', protectUser, protectEducator, educatorEnrollUser)
educatorRouter.get('/dashboard', protectUser, protectEducator, educatorDashboardData)

export default educatorRouter;