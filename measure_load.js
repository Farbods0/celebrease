const https = require('https');
const http = require('http');

function measure(url) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        https.get(url, (res) => {
            const ttfb = Date.now() - start;
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const total = Date.now() - start;
                resolve({ ttfb, total, status: res.statusCode, size: data.length });
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log("Measuring celebrease.com load time...");
    try {
        const res = await measure('https://celebrease.com/');
        console.log(`Status: ${res.status}`);
        console.log(`TTFB: ${res.ttfb} ms`);
        console.log(`Total: ${res.total} ms`);
        console.log(`Size: ${res.size} bytes`);
    } catch(e) {
        console.error(e);
    }
}
run();
