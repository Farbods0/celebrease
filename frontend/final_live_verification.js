const { chromium } = require('playwright');

(async () => {
    console.log('✨ Running Final Live Production Verification...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    let errorsFound = 0;

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`[Console Error] ${msg.text()} at ${page.url()}`);
            errorsFound++;
        }
    });

    page.on('response', res => {
        if (res.status() >= 400 && !res.url().includes('favicon') && !res.url().includes('google-analytics')) {
            console.log(`[HTTP Error ${res.status()}] ${res.url()} on ${page.url()}`);
            errorsFound++;
        }
    });

    console.log('1. Checking Consumer Catalog...');
    await page.goto('https://celebrease.com/catalog/christmas', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    console.log('2. Checking Signup Validation...');
    await page.goto('https://celebrease.com/signup', { waitUntil: 'networkidle' });
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Mismatch123!');
    await page.waitForTimeout(500);

    const hasMatchErr = await page.evaluate(() => document.body.innerText.includes('match') || document.body.innerText.includes('Passwords do not match'));
    console.log(`   Real-time password mismatch error present: ${hasMatchErr}`);

    console.log('3. Checking Admin Portal Redirect Cleanliness...');
    await page.goto('https://admin.celebrease.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await browser.close();

    console.log(`\n🎉 Final Verification Completed! Total unexpected errors: ${errorsFound}`);
})();
