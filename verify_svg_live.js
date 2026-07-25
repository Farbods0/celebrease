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
                await page.waitForTimeout(1000); 
            }

            // In holiday-details.tsx, we have a gallery image tag, which might not have a specific class. 
            // We can just grab all images and check if any src ends with '.svg' and has 'starter'
            const allImages = await page.locator('img').all();
            
            for (const img of allImages) {
                const src = await img.getAttribute('src');
                if (src && src.includes('ny-starter-2026_angle1.svg')) {
                    console.log("SUCCESS: The new Starter SVG distinct placeholder is live!");
                    verified = true;
                    break;
                }
            }
            
            if (!verified) {
                console.log(`Still seeing old images. Deployment in progress...`);
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
