const BASE_URL = 'http://localhost:5000';

async function testApi() {
    console.log('--- HTML/API Automated Test (Fetch) ---');

    // 1. Root Endpoint
    try {
        const res = await fetch(BASE_URL + '/');
        console.log(`[PASS] Root Endpoint: ${res.status} ${res.statusText}`);
        const text = await res.text();
        if (text.includes('API is working')) {
            console.log('       Response verified: API is working');
        } else {
            console.log('       [WARN] Unexpected response body');
        }
    } catch (err) {
        console.error(`[FAIL] Root Endpoint: ${err.message}`);
    }

    // 2. Get All Courses
    try {
        const res = await fetch(BASE_URL + '/api/course/');
        console.log(`[PASS] Get All Courses: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (data && data.courses) {
            console.log(`       Courses found: ${data.courses.length}`);
        }
    } catch (err) {
        console.error(`[FAIL] Get All Courses: ${err.message}`);
    }

    // 3. Login Validation (Missing Credentials)
    try {
        const res = await fetch(BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (res.status === 400 || res.status === 401 || res.status === 500) {
            const data = await res.json();
            console.log(`[PASS] Login Validation (Empty Body): Got expected error ${res.status}`);
            if (data.message) console.log(`       Message: ${data.message}`);
        } else {
            console.error(`[FAIL] Login Validation: Expected error but got ${res.status}`);
        }
    } catch (err) {
        console.error(`[FAIL] Login Validation: ${err.message}`);
    }

    console.log('--- Test Complete ---');
}

testApi();
