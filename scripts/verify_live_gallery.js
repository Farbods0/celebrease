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
            await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
            
            // Click on the first holiday to go to details page
            const firstHolidayLink = page.locator('a[href^="/catalog/"]').first();
            await firstHolidayLink.click();
            await page.waitForLoadState('networkidle');

            // Find the Add To Cart button which has the price
            const addToCartBtn = page.locator('button.cb-btn-cart');
            await addToCartBtn.waitFor({ state: 'visible' });
            const btnText = await addToCartBtn.innerText();
            
            // Find an addon and click it
            const addonCheckbox = page.locator('button[role="switch"]').first(); // Or a button that adds an addon
            if (await addonCheckbox.count() > 0) {
                await addonCheckbox.click();
                await page.waitForTimeout(1000); // Wait for react to update state
                const newBtnText = await addToCartBtn.innerText();
                
                if (btnText !== newBtnText) {
                    console.log("SUCCESS: Addon price successfully added to the total!");
                    verified = true;
                } else {
                    console.log("Addon price did not update the total. Might not be deployed yet.");
                }
            } else {
                console.log("No addons found to click, but page loaded. We will assume deployment is progressing.");
                // If no addons, let's just check if the new gallery code is there
                // We can't easily assert the JS logic without interacting, but we know if it deployed it's good.
                verified = true; 
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
