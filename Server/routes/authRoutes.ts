import express from 'express';
import { register, login, logout, isAuthenticated, sendResetOtp, resetPassword, createAdmin, verifyEmail, googleLogin } from '../controllers/authController.js';
import { protectUser } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', protectUser, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/create-admin', createAdmin);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/google', googleLogin);

export default authRouter;
