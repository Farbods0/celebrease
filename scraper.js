const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download: ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', reject);
    });
}

async function scrapeDuckDuckGo(query, count) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const results = [];
    
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        const locators = page.locator('img.tile--img__img');
        const numImages = await locators.count();
        
        let saved = 0;
        for (let i = 0; i < numImages && saved < count; i++) {
            const src = await locators.nth(i).getAttribute('src');
            if (src && src.startsWith('//')) {
                results.push('https:' + src);
                saved++;
            }
        }
    } catch(e) {
        console.error(e);
    }
    
    await browser.close();
    return results;
}

(async () => {
    console.log("Scraping for:", process.argv[2]);
    const urls = await scrapeDuckDuckGo(process.argv[2], 4);
    console.log("Found:", urls);
})();
