import { clerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protectUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        if (decoded.id) {
            req.auth = { userId: decoded.id };
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        next();

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

// Middleware (Protect Educator Routes )
export const protectEducator = async (req: any, res: any, next: NextFunction) => {
    try {
        const userId = req.auth.userId
        const user = await import("../models/user.js").then(module => module.default.findById(userId));

        if (!user || (user.role !== 'educator' && user.role !== 'admin')) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }
        next()
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }

}