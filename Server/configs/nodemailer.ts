import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'navanithaweb@gmail.com',
        pass: process.env.SMTP_PASS // Keep pass from env as it worked in test script
    }
});

export default transporter;
