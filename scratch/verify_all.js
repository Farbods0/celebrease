const { chromium } = require('playwright');

(async () => {
    console.log("Launching browser for comprehensive verification...");
    const browser = await chromium.launch();
    
    try {
        // Test 1: Consumer Login Redirection
        console.log("--- TEST 1: Consumer Login Redirection ---");
        const ctx1 = await browser.newContext();
        const page1 = await ctx1.newPage();
        
        console.log("Navigating to https://www.celebrease.com/signin...");
        await page1.goto('https://www.celebrease.com/signin', { waitUntil: 'networkidle', timeout: 30000 });
        
        console.log("Filling login form...");
        await page1.fill('input[type="email"]', 'Farbods0@gmail.com');
        await page1.fill('input[type="password"]', 'Password123!');
        await page1.click('button:has-text("Sign In")');
        
        console.log("Waiting for navigation...");
        await page1.waitForNavigation({ timeout: 15000 }).catch(e => console.log("Navigation timeout, checking URL anyway."));
        
        const url1 = page1.url();
        console.log("Current URL after sign in:", url1);
        if (url1.includes('/account')) {
            console.log("SUCCESS: Consumer login correctly redirected to /account");
        } else {
            console.log("ERROR: Did not redirect to /account. Ended up at " + url1);
        }
        await ctx1.close();

        // Test 2: Admin Accessibility Grid
        console.log("\n--- TEST 2: Admin A11y Data Grids ---");
        const ctx2 = await browser.newContext({ viewport: { width: 375, height: 667 } }); // Mobile viewport to trigger md:hidden
        const page2 = await ctx2.newPage();
        
        console.log("Navigating to https://admin.celebrease.com/orders...");
        let adminSuccess = false;
        try {
            await page2.goto('https://admin.celebrease.com/orders', { waitUntil: 'networkidle', timeout: 30000 });
            // The admin might redirect to login, so let's log in
            if (page2.url().includes('signin') || page2.url().includes('login')) {
                console.log("Logging into admin...");
                await page2.fill('input[type="email"]', 'Farbods0@gmail.com');
                await page2.fill('input[type="password"]', 'Password123!');
                await page2.click('button[type="submit"]');
                await page2.waitForNavigation({ timeout: 15000 }).catch(() => {});
                await page2.goto('https://admin.celebrease.com/orders', { waitUntil: 'networkidle' });
            }
            
            // Check for table or role=table
            const tables = await page2.locator('table, [role="table"]').count();
            console.log(`Found ${tables} table(s) or role=table elements on orders page.`);
            if (tables > 0) {
                console.log("SUCCESS: Admin data grids use semantic table or role=table.");
            } else {
                console.log("ERROR: No tables found in mobile view.");
            }
        } catch(e) {
            console.log("Admin test failed (possibly admin.celebrease.com is not reachable):", e.message);
        }
        await ctx2.close();

    } catch (e) {
        console.error("Critical error during verification:", e);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
})();
