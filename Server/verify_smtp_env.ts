import 'dotenv/config';

console.log('Checking SMTP Environment Variables...');
console.log('SMTP_HOST:', process.env.SMTP_HOST ? process.env.SMTP_HOST : 'UNDEFINED');
console.log('SMTP_PORT:', process.env.SMTP_PORT ? process.env.SMTP_PORT : 'UNDEFINED');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'UNDEFINED');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'UNDEFINED');
