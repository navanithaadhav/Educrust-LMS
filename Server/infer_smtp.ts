import 'dotenv/config';

const user = process.env.SMTP_USER || '';
if (user.includes('@')) {
    const domain = user.split('@')[1];
    console.log(`SMTP_DOMAIN:${domain}`);
} else {
    console.log('SMTP_USER_FORMAT_INVALID');
}
