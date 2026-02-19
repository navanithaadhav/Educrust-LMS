import { Webhook } from 'svix';
import User from '../models/user.js';
import { Request, Response } from 'express';

// API controller Function to manage Clerk User with database
export const clerkWebhooks = async (req: Request, res: Response) => {
    console.log("Webhook hit!");
    try {
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        if (!secret) {
            console.error("Missing CLERK_WEBHOOK_SECRET");
            throw new Error("Missing CLERK_WEBHOOK_SECRET");
        }

        const whook = new Webhook(secret);

        // Log raw body for debugging (be careful with sensitive data in prod)
        // console.log("Raw body:", (req as any).rawBody);

        await whook.verify((req as any).rawBody, {
            "svix-id": req.headers["svix-id"] as string,
            "svix-timestamp": req.headers["svix-timestamp"] as string,
            "svix-signature": req.headers["svix-signature"] as string
        })

        const { data, type } = req.body
        console.log(`Webhook verified. Type: ${type}`);

        switch (type) {
            case 'user.created': {
                console.log("Creating user:", data.id);

                const firstName = data.first_name || '';
                const lastName = data.last_name || '';
                const email = data.email_addresses && data.email_addresses[0] ? data.email_addresses[0].email_address : '';

                if (!email) {
                    console.error("No email found for user:", data.id);
                    return res.status(400).json({ success: false, message: "No email address found" });
                }

                const userData = {
                    _id: data.id,
                    email: email,
                    name: (firstName + ' ' + lastName).trim() || 'No Name',
                    imageUrl: data.image_url,
                }

                try {
                    const newUser = await User.create(userData)
                    console.log("User created in DB:", newUser._id);
                    return res.json({ success: true })
                } catch (dbError: any) {
                    console.error("Database error creating user:", dbError.message);
                    return res.status(500).json({ success: false, message: dbError.message });
                }
            }
            case 'user.updated': {
                console.log("Updating user:", data.id);
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + ' ' + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                console.log("User updated in DB");
                res.json({})
                break;
            }
            case 'user.deleted': {
                console.log("Deleting user:", data.id);
                await User.findByIdAndDelete(data.id)
                console.log("User deleted from DB");
                res.json({})
                break;
            }
            default:
                console.log("Unhandled webhook type:", type);
                break;
        }
    } catch (error: any) {
        console.error("Webhook error:", error.message);
        res.json({ success: false, message: error.message })
    }

}