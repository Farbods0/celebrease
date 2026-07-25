const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        await page.goto('https://celebrease.com/catalog/evt-001', { waitUntil: 'networkidle' });
        
        const starterTierBtn = page.locator('.cb-tier-card').filter({ hasText: /STARTER/i });
        if (await starterTierBtn.count() > 0) {
            await starterTierBtn.click();
            await page.waitForTimeout(1000); 
        }

        const mainImg = page.locator('.cb-gallery-main img');
        await mainImg.waitFor({ state: 'visible', timeout: 10000 });
        const src = await mainImg.getAttribute('src');
        
        if (src && src.includes('ny_starter_kit')) {
            console.log("SUCCESS: The new Starter kit specific image is live!");
        } else {
            console.log(`Failed: Still seeing old image: ${src}.`);
        }
    } catch (e) {
        console.log(`Error checking: ${e.message}`);
    }

    await browser.close();
})();
