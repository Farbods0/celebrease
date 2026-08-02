const { chromium } = require('playwright');

(async () => {
    let retries = 5;
    let success = false;
    
    while (retries > 0 && !success) {
        console.log(`Checking deployment... (retries left: ${retries})`);
        const browser = await chromium.launch();
        const page = await browser.newPage();
        
        try {
            await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
            
            // Check if 4.9 is on the page
            const homeContent = await page.content();
            if (homeContent.includes('4.9') || homeContent.includes('★★★★★')) {
                console.log('Homepage still has rating mentions. Deployment might not be finished yet.');
                await browser.close();
                retries--;
                await new Promise(r => setTimeout(r, 20000));
                continue;
            }
            
            await page.goto('https://celebrease.com/catalog/evt-001', { waitUntil: 'networkidle' });
            const kitContent = await page.content();
            if (kitContent.includes('4.9') || kitContent.includes('127 reviews')) {
                console.log('Kit details page still has rating mentions. Waiting...');
                await browser.close();
                retries--;
                await new Promise(r => setTimeout(r, 20000));
                continue;
            }
            
            console.log('VALIDATION SUCCESS: All rating mentions have been successfully removed from production!');
            success = true;
            await browser.close();
            
        } catch (e) {
            console.error('Error during validation:', e);
            await browser.close();
            retries--;
            await new Promise(r => setTimeout(r, 20000));
        }
    }
    
    if (!success) {
        console.error('VALIDATION FAILED: Ratings are still present on production after 5 retries.');
        process.exit(1);
    }
})();
