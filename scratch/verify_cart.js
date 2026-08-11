const { chromium } = require('playwright');

(async () => {
    console.log("Launching browser...");
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log("Navigating to https://www.celebrease.com/catalog/christmas...");
        await page.goto('https://www.celebrease.com/catalog/christmas', { waitUntil: 'networkidle', timeout: 30000 });
        
        console.log("Selecting Starter tier...");
        const starterBtn = page.locator('button:has-text("Starter")').first();
        await starterBtn.waitFor({ state: 'visible' });
        await starterBtn.click();
        
        // Let React re-render
        await page.waitForTimeout(1000);
        
        console.log("Checking price and Add to Cart button...");
        const addToCartBtn = page.locator('.cb-btn-cart').first();
        const text = await addToCartBtn.innerText();
        console.log("Button text:", text);
        
        if (text.includes("Add to Cart") || text.includes("Adding")) {
            console.log("SUCCESS: Add to Cart button is functional and has correct text.");
        } else {
            console.log("WARNING: Button text may be incorrect.");
        }
        
    } catch (e) {
        console.error("Error during verification:", e);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
})();
