import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
try {
    let content = fs.readFileSync(envPath, 'utf8');

    // Ensure newline
    if (!content.endsWith('\n')) {
        content += '\n';
    }

    // Append if not present
    if (!content.includes('SMTP_HOST')) {
        content += "SMTP_HOST='smtp-relay.brevo.com'\n";
        console.log('Added SMTP_HOST');
    } else {
        console.log('SMTP_HOST already present');
    }

    if (!content.includes('SMTP_PORT')) {
        content += "SMTP_PORT='587'\n";
        console.log('Added SMTP_PORT');
    } else {
        console.log('SMTP_PORT already present');
    }

    fs.writeFileSync(envPath, content);
    console.log('Updated .env successfully');
} catch (err) {
    console.error('Error updating .env:', err);
}
