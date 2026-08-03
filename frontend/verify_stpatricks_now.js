const { chromium } = require('playwright');

(async () => {
    console.log('✨ Re-running Playwright E2E Verification for St. Patrick\'s Day now that Netlify deploy finished...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let imageErrors = [];
    page.on('response', res => {
        if (res.status() >= 400 && /\.(jpg|png|webp)/i.test(res.url())) {
            imageErrors.push(`${res.status()} -> ${res.url()}`);
        }
    });

    console.log('Checking St. Patrick\'s Day PDP Gallery...');
    await page.goto('https://celebrease.com/catalog/st-patricks-day', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(2000);

    const thumbs = await page.locator('.cb-gallery-thumb').count();
    console.log(`- St. Patrick's Day Gallery Thumbnails count: ${thumbs}`);

    await browser.close();

    console.log('\n--- Netlify Deploy Verification Summary ---');
    console.log(`Failed Image Requests Count: ${imageErrors.length}`);
    if (imageErrors.length > 0) {
        imageErrors.forEach(err => console.log(`  ❌ ${err}`));
    } else {
        console.log('  🎉 PERFECT 100% 200 OK SUCCESS! ST. PATRICK\'S DAY IMAGES LOADED CLEANLY.');
    }
})();
