import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;

const backendUrl = "https://celebrease-backend-production-4778.up.railway.app";
const loginUrl = `${backendUrl}/api/auth/sign-in/email`;
const uploadUrl = `${backendUrl}/api/v1/upload/image?folder=holidays`;

const images = [
    { sku: 'bday-starter', file: 'bday-starter-2026.jpg' },
    { sku: 'bday-premium', file: 'bday-premium-2026.jpg' },
    { sku: 'hal-starter', file: 'hal-starter-2026.jpg' },
    { sku: 'hal-premium', file: 'hal-premium-2026.jpg' },
    { sku: 'ny-starter', file: 'ny-starter-2026.jpg' },
    { sku: 'ny-premium', file: 'ny-premium-2026.jpg' },
    { sku: 'ram-starter', file: 'ram-starter-2026.jpg' },
    { sku: 'val-starter', file: 'val-starter-2026.jpg' },
    { sku: 'val-premium', file: 'val-premium-2026.jpg' },
    { sku: 'xmas-starter', file: 'xmas-starter-2026.jpg' },
    { sku: 'xmas-premium', file: 'xmas-premium-2026.jpg' },
    { sku: 'xmas-ultimate', file: 'xmas-ultimate-2026.jpg' }
];

async function upload() {
    console.log("Logging in...");
    const loginRes = await fetch(loginUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Origin': 'https://admin.celebrease.com'
        },
        body: JSON.stringify({
            email: 'test_edd18b33@celebrease.com',
            password: 'Password123!'
        })
    });
    
    if (!loginRes.ok) {
        console.error("Login failed!", loginRes.status, await loginRes.text());
        return;
    }
    
    let cookies = loginRes.headers.get('set-cookie');
    if (cookies) {
        cookies = cookies.split(';')[0];
    }
    
    const urlMap = {};

    for (const item of images) {
        const file = item.file;
        const filePath = path.join(process.cwd(), 'backend', 'uploads', 'holidays', file);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            continue;
        }
        const buffer = fs.readFileSync(filePath);
        
        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('file', blob, file);
        
        try {
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Cookie': cookies,
                    'Origin': 'https://admin.celebrease.com'
                },
                body: formData
            });
            const data = await res.json();
            console.log(`Result for ${file}:`, data.url);
            urlMap[item.sku] = data.url;
        } catch (e) {
            console.error(`Error uploading ${file}:`, e);
        }
    }
    
    // Update DB
    console.log("Updating database with new URLs:", urlMap);
    const pool = new Pool({
        connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
    });
    
    for (const [sku, url] of Object.entries(urlMap)) {
        await pool.query('UPDATE kit SET images = $1 WHERE sku = $2', [[url], sku]);
        console.log(`Updated sku ${sku} with images ['${url}']`);
    }
    
    await pool.end();
    console.log("Finished successfully!");
}
upload();
