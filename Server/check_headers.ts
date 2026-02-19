async function checkHeaders() {
    try {
        const res = await fetch('http://localhost:5000/');
        console.log('Status:', res.status);
        console.log('Headers:');

        const headersToCheck = [
            'x-rate-limit-limit',
            'x-ratelimit-limit', // Check both cases
            'content-security-policy',
            'x-content-type-options',
            'strict-transport-security',
            'x-frame-options'
        ];

        let foundSecurity = false;
        let foundRateLimit = false;

        res.headers.forEach((val, key) => {
            if (headersToCheck.includes(key.toLowerCase()) || key.toLowerCase().includes('rate')) {
                console.log(`${key}: ${val}`);
                if (key.toLowerCase().includes('security') || key.toLowerCase().includes('frame')) foundSecurity = true;
                if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('limit')) foundRateLimit = true;
            }
        });

        if (foundSecurity) console.log('[PASS] Security headers found.');
        else console.log('[FAIL] No security headers found.');

        if (foundRateLimit) console.log('[PASS] Rate limit headers found.');
        else console.log('[FAIL] No rate limit headers found.');

    } catch (e) {
        console.error('Error fetching:', e.message);
    }
}
checkHeaders();
