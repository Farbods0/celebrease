const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let found = false;
    for (let i = 0; i < 20; i++) {
        await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
        const text = await page.content();
        if (text.includes("Premium Kit") && text.includes("Independence Day")) {
            console.log("Found 'Premium Kit Independence Day'! Deployment is live.");
            found = true;
            break;
        }
        console.log("Not found yet, waiting 5 seconds...");
        await new Promise(r => setTimeout(r, 5000));
    }
    if (!found) {
        console.log("Timeout waiting for deployment.");
        process.exit(1);
    }
    await browser.close();
})();
