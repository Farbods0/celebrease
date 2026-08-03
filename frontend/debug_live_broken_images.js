const { chromium } = require('playwright');

(async () => {
    console.log('🔍 DEBUGGING EXACT BROKEN IMAGE URLS ON LIVE PRODUCTION...\n');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('1. Checking PDP https://celebrease.com/catalog/thanksgiving');
    await page.goto('https://celebrease.com/catalog/thanksgiving', { waitUntil: 'networkidle' });

    const pdpBroken = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            complete: img.complete,
            alt: img.alt
        }));
    });
    console.log('PDP All Images:');
    console.table(pdpBroken);

    console.log('\n2. Checking About Page https://celebrease.com/about');
    await page.goto('https://celebrease.com/about', { waitUntil: 'networkidle' });

    const aboutBroken = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            complete: img.complete,
            alt: img.alt
        }));
    });
    console.log('About All Images:');
    console.table(aboutBroken);

    await browser.close();
})();
