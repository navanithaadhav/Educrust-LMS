
import express from 'express';
import { addCourseRating, getAllCourses, getCourseById, seedCourses, getLectureContent } from '../controllers/courseController.js';

import { protectUser } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router();

courseRouter.get('/', getAllCourses);
courseRouter.get('/content', protectUser, getLectureContent);
courseRouter.get('/:id', getCourseById);
courseRouter.post('/:id/rating', protectUser, addCourseRating);
courseRouter.post('/seed', protectUser, seedCourses);

export default courseRouter;
