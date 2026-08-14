const { chromium } = require('playwright');

(async () => {
    console.log('✨ Measuring Live Performance after Netlify Deploy of Commit 1b65428...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let railwayCallsCount = 0;
    page.on('request', req => {
        if (req.url().includes('railway.app')) {
            console.log(`[RAILWAY CALL] ${req.url()}`);
            railwayCallsCount++;
        }
    });

    console.log('1. Loading Homepage (https://celebrease.com)...');
    const t0 = Date.now();
    await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
    const t1 = Date.now();
    console.log(`-> Homepage networkidle: ${t1 - t0}ms (Railway calls: ${railwayCallsCount})`);

    railwayCallsCount = 0;
    console.log('\n2. Navigating to Catalog (https://celebrease.com/catalog)...');
    const c0 = Date.now();
    await page.goto('https://celebrease.com/shop-kits', { waitUntil: 'networkidle' });
    const c1 = Date.now();
    console.log(`-> Catalog networkidle: ${c1 - c0}ms (Railway calls: ${railwayCallsCount})`);

    await browser.close();

    console.log('\n================ PERFORMANCE AUDIT SUMMARY ================');
    console.log(`Homepage Load: ${t1 - t0}ms`);
    console.log(`Catalog Load: ${c1 - c0}ms`);
})();
