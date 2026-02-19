import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

// ... existing imports ...

export const register = async (req: any, res: any) => {
    // ... existing register code ...
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isAccountVerified) {
                return res.json({ success: false, message: "User already exists" });
            } else {
                // User exists but not verified. Resend OTP.
                const otp = String(Math.floor(100000 + Math.random() * 900000));
                existingUser.verificationOtp = otp;
                existingUser.verificationOtpExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
                // Optionally update password/name here if we want to allow overwriting them for unverified accounts
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.password = hashedPassword;
                existingUser.name = name;

                await existingUser.save();

                // Send OTP via Email
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: existingUser.email,
                    subject: 'Account Verification OTP',
                    html: `
                        <div style="font-family: Arial, sans-serif; min-height: 100vh; background-color: #f4f4f4; display: flex; align-items: center; justify-content: center;">
                            <br/>
                            <div style="background: white; padding: 20px 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center;">
                                <img src="https://ui-avatars.com/api/?name=Edu+Crest&background=4F46E5&color=fff&size=80&rounded=true&bold=true" alt="EduCrest Logo" style="width: 80px; margin-bottom: 20px; border-radius: 50%;">
                                <h2 style="color: #333; margin-bottom: 10px;">Verify Your Account</h2>
                                <p style="color: #666; margin-bottom: 20px;">Welcome back to EduCrest! Use the code below to verify your email address.</p>
                                <div style="background: #eef2ff; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">
                                    ${otp}
                                </div>
                                <p style="color: #666; margin-top: 20px; font-size: 12px;">This code is valid for 24 hours.</p>
                                <p style="color: #aaa; margin-top: 10px; font-size: 10px;">If you did not request this, please ignore this email.</p>
                            </div>
                        <br/>
                        </div>
                    `
                }

                console.log(`[Register] Resent OTP for ${existingUser.email}: ${otp}`);

                try {
                    const nodemailerModule = await import('../configs/nodemailer.js');
                    const transporter = nodemailerModule.default;
                    await transporter.sendMail(mailOptions);
                    console.log(`[Register] Email sent to ${existingUser.email}`);
                } catch (emailError) {
                    console.error(`[Register] Failed to send email:`, emailError);
                }

                return res.json({ success: true, message: 'OTP sent to your email', isOtpSent: true });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id: email, // Staying consistent with existing schema if it used string IDs, though ObjectId is better. 
            // Checking previous file user.ts, it had _id: { type: String, required: true }. 
            // In typical Clerk setups, ID is string. Let's use auto-generated ObjectId if possible, but the schema enforced String.
            // Let's assume we can remove _id requirement or generate one. 
            // WAIT - the previous schema had _id required. I will use a UUID or similar if I can't let Mongo do it.
            // actually, let's just use the email as ID or generate a random one to satisfy the schema if I didn't change it enough.
            // Re-reading user.ts: _id:{ type: String, required: true }
            // I'll make the _id the email or a unique string.
            name,
            email,
            password: hashedPassword
        })

        // Let's actually use a library for ID or just allow mongo to generate if I remove the _id line. 
        // But since I didn't remove the _id line in the previous step (I only modified the body), 
        // I should set it. 
        user._id = Date.now().toString(36) + Math.random().toString(36).substr(2);

        await user.save();

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verificationOtp = otp;
        user.verificationOtpExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send OTP via Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; min-height: 100vh; background-color: #f4f4f4; display: flex; align-items: center; justify-content: center;">
                    <br/>
                    <div style="background: white; padding: 20px 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center;">
                        <img src="https://ui-avatars.com/api/?name=Edu+Crest&background=4F46E5&color=fff&size=80&rounded=true&bold=true" alt="EduCrest Logo" style="width: 80px; margin-bottom: 20px; border-radius: 50%;">
                        <h2 style="color: #333; margin-bottom: 10px;">Verify Your Account</h2>
                        <p style="color: #666; margin-bottom: 20px;">Welcome to EduCrest! Use the code below to verify your email address and complete your registration.</p>
                        <div style="background: #eef2ff; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">
                            ${otp}
                        </div>
                        <p style="color: #666; margin-top: 20px; font-size: 12px;">This code is valid for 24 hours.</p>
                        <p style="color: #aaa; margin-top: 10px; font-size: 10px;">If you did not request this, please ignore this email.</p>
                    </div>
                <br/>
                </div>
            `
        }

        console.log(`[Register] Generated OTP for ${user.email}: ${otp}`); // For debugging

        try {
            const nodemailerModule = await import('../configs/nodemailer.js');
            const transporter = nodemailerModule.default;
            await transporter.sendMail(mailOptions);
            console.log(`[Register] Email sent to ${user.email}`);
        } catch (emailError) {
            console.error(`[Register] Failed to send email:`, emailError);
            // Proceed anyway so they can verified via console OTP if dev
        }

        return res.json({ success: true, message: 'OTP sent to your email', isOtpSent: true });

    } catch (error: any) {
        return res.json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req: any, res: any) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verificationOtp === '' || user.verificationOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verificationOtpExpire < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verificationOtp = '';
        user.verificationOtpExpire = 0;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Email verified successfully', user: { name: user.name, role: user.role } });

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        console.log(`[DEBUG] Login attempt for: ${email}`);

        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // @ts-ignore
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isAccountVerified) {
            console.log(`[DEBUG] User ${email} is NOT verified. Entering resend logic...`);
            // Resend OTP logic
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.verificationOtp = otp;
            user.verificationOtpExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            await user.save();

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Account Verification OTP',
                html: `
                <div style="font-family: Arial, sans-serif; min-height: 100vh; background-color: #f4f4f4; display: flex; align-items: center; justify-content: center;">
                    <br/>
                    <div style="background: white; padding: 20px 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center;">
                        <img src="https://ui-avatars.com/api/?name=Edu+Crest&background=4F46E5&color=fff&size=80&rounded=true&bold=true" alt="EduCrest Logo" style="width: 80px; margin-bottom: 20px; border-radius: 50%;">
                        <h2 style="color: #333; margin-bottom: 10px;">Verify Your Account</h2>
                        <p style="color: #666; margin-bottom: 20px;">Welcome back! You tried to login but your account is not verified. Use the code below to verify your email address.</p>
                        <div style="background: #eef2ff; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">
                            ${otp}
                        </div>
                        <p style="color: #666; margin-top: 20px; font-size: 12px;">This code is valid for 24 hours.</p>
                        <p style="color: #aaa; margin-top: 10px; font-size: 10px;">If you did not request this, please ignore this email.</p>
                    </div>
                <br/>
                </div>
            `
            }
            try {
                // Use fresh import or just standard transporter if top level is fine. 
                // But to be safe and debug:
                console.log(`[Login] Attempting to resend OTP to ${user.email} with updated logic (v2)...`);
                const nodemailerModule = await import('../configs/nodemailer.js');
                const transporter = nodemailerModule.default;

                await transporter.verify(); // verify connection before sending
                console.log('[Login] Transporter connection verified.');

                await transporter.sendMail(mailOptions);
                console.log(`[Login] Resent verification email to ${user.email}`);
            } catch (emailError) {
                console.error(`[Login] Failed to send email:`, emailError);
            }

            return res.json({ success: false, message: 'Account not verified. A new OTP has been sent to your email.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Logged in successfully', user: { name: user.name, role: user.role } });

    } catch (error: any) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req: any, res: any) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        return res.json({ success: true, message: 'Logged out' });
    } catch (error: any) {
        return res.json({ success: false, message: error.message })
    }
}

export const isAuthenticated = async (req: any, res: any) => {
    try {
        // If the middleware passed, we are auth.
        // check middleware attachment in routes
        return res.json({ success: true, message: 'Authenticated', userId: req.auth.userId });
    } catch (error: any) {
        return res.json({ success: false, message: error.message })
    }
}

export const sendResetOtp = async (req: any, res: any) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Debugging logs
        console.log(`[sendResetOtp] Preparing to send OTP to: ${user.email}`);
        console.log(`[sendResetOtp] SENDER_EMAIL: ${process.env.SENDER_EMAIL}`);
        console.log(`[sendResetOtp] SMTP_USER: ${process.env.SMTP_USER}`);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
        }

        const nodemailerModule = await import('../configs/nodemailer.js');
        const transporter = nodemailerModule.default;

        console.log('[sendResetOtp] Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('[sendResetOtp] Email sent info:', info);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error: any) {
        console.error('[sendResetOtp] Error sending email:', error);
        return res.json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req: any, res: any) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpire < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpire = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export const createAdmin = async (req: any, res: any) => {
    try {
        const { email, password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user to be admin with new password
            user.password = hashedPassword;
            user.role = 'admin';
            user.isAccountVerified = true;
            // user.name = name; // Optional: update name too if you want
            await user.save();
            return res.json({ success: true, message: 'Admin updated successfully' });
        }


        user = new User({
            _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            imageUrl: "https://i.ibb.co/6r4Jj70/user.png",
            enrolledCourses: [],
            isAccountVerified: true
        });

        await user.save();
        return res.json({ success: true, message: 'Admin created successfully' });
    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export const googleLogin = async (req: any, res: any) => {
    try {
        const { credential, access_token } = req.body;

        let googleEmail, googleName, googleSub, googlePicture;

        if (access_token) {
            const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (!response.ok) {
                return res.json({ success: false, message: "Invalid Access Token" });
            }

            const data: any = await response.json();
            googleEmail = data.email;
            googleName = data.name;
            googleSub = data.sub;
            googlePicture = data.picture;
        } else if (credential) {
            const client = new OAuth2Client();
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload) {
                return res.json({ success: false, message: "Invalid Google Token" });
            }

            googleEmail = payload.email;
            googleName = payload.name;
            googleSub = payload.sub;
            googlePicture = payload.picture;
        } else {
            return res.json({ success: false, message: "No credential or access_token provided" });
        }

        if (!googleEmail) {
            return res.json({ success: false, message: "Google account has no email" });
        }

        let user = await User.findOne({ email: googleEmail });

        if (!user) {
            // Create new user
            user = new User({
                _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                name: googleName,
                email: googleEmail,
                password: await bcrypt.hash(googleSub + Date.now(), 10), // Random password
                imageUrl: googlePicture,
                isAccountVerified: true, // Google accounts are verified
            });
            await user.save();
        } else {
            // You logic to update user if needed, e.g. verify them if not verified
            if (!user.isAccountVerified) {
                user.isAccountVerified = true;
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Logged in with Google', user: { name: user.name, role: user.role, imageUrl: user.imageUrl } });

    } catch (error: any) {
        console.error("Google Login Error:", error);
        return res.json({ success: false, message: error.message });
    }
}
