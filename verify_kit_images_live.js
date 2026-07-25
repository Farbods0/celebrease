const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let verified = false;
    let attempts = 0;

    while (!verified && attempts < 15) {
        attempts++;
        console.log(`Attempt ${attempts}: Checking live site...`);
        try {
            await page.goto('https://celebrease.com/catalog/evt-001', { waitUntil: 'networkidle' });
            
            // The Starter kit is the first one or we can just click the Starter tier card
            const starterTierBtn = page.locator('.cb-tier-card').filter({ hasText: /STARTER/i });
            if (await starterTierBtn.count() > 0) {
                await starterTierBtn.click();
                await page.waitForTimeout(1000); // wait for react render
            }

            // Check the main image src
            const mainImg = page.locator('img.cb-main-img');
            await mainImg.waitFor({ state: 'visible' });
            const src = await mainImg.getAttribute('src');
            
            // Our starter kit image ends with ny_starter_kit_1785004034470.jpg
            if (src && src.includes('ny_starter_kit')) {
                console.log("SUCCESS: The new Starter kit specific image is live!");
                verified = true;
            } else {
                console.log(`Still seeing old image: ${src}. Deployment in progress...`);
            }
        } catch (e) {
            console.log(`Error checking: ${e.message}`);
        }

        if (!verified) {
            await new Promise(r => setTimeout(r, 15000));
        }
    }

    if (verified) {
        console.log("Verification successful on production!");
    } else {
        console.log("Verification timed out.");
    }
    await browser.close();
})();
