const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONSUMER_URL = 'https://celebrease.com';
const ADMIN_URL = 'https://admin.celebrease.com';

const reportDir = path.join(__dirname, 'screenshots_audit');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const auditResults = {
    timestamp: new Date().toISOString(),
    consumer: { pagesTested: 0, issues: [] },
    admin: { pagesTested: 0, issues: [] },
    consoleErrors: [],
    networkErrors: [],
    imageErrors: [],
};

(async () => {
    console.log('🚀 Starting Full-Spectrum E2E Production Regression Audit...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Listen for console errors & network failures
    page.on('console', msg => {
        if (msg.type() === 'error') {
            const err = `[CONSOLE ERROR] ${msg.text()} (${page.url()})`;
            console.log(`⚠️ ${err}`);
            auditResults.consoleErrors.push(err);
        }
    });

    page.on('response', response => {
        const status = response.status();
        const url = response.url();
        if (status >= 400 && !url.includes('favicon') && !url.includes('google-analytics')) {
            const err = `[NETWORK ${status}] ${response.request().method()} ${url} on page ${page.url()}`;
            console.log(`❌ ${err}`);
            auditResults.networkErrors.push(err);
        }
    });

    // Helper to test page images & broken links
    async function auditPage(targetUrl, siteName, pageName) {
        console.log(`\n🔍 Auditing ${siteName} -> ${pageName} (${targetUrl})...`);
        try {
            const res = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(async () => {
                return await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
            });

            if (siteName === 'consumer') auditResults.consumer.pagesTested++;
            else auditResults.admin.pagesTested++;

            // Screenshot
            const shotPath = path.join(reportDir, `${siteName}_${pageName.replace(/[^a-z0-9]/gi, '_')}.png`);
            await page.screenshot({ path: shotPath, fullPage: false });

            // Audit Images
            const brokenImages = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs
                    .filter(img => !img.complete || img.naturalWidth === 0 || img.src.includes('undefined') || img.src.includes('null'))
                    .map(img => ({ src: img.src, alt: img.alt, outerHTML: img.outerHTML }));
            });

            if (brokenImages.length > 0) {
                console.log(`  ❌ Found ${brokenImages.length} broken image(s) on ${pageName}`);
                brokenImages.forEach(img => {
                    const issueStr = `Broken image on ${targetUrl}: src="${img.src}"`;
                    auditResults.imageErrors.push(issueStr);
                    const list = siteName === 'consumer' ? auditResults.consumer.issues : auditResults.admin.issues;
                    list.push({ type: 'Broken Image', location: targetUrl, detail: issueStr });
                });
            }

            // Check page title & h1
            const title = await page.title();
            const h1Count = await page.locator('h1').count();
            if (h1Count === 0) {
                const list = siteName === 'consumer' ? auditResults.consumer.issues : auditResults.admin.issues;
                list.push({ type: 'SEO / UX Warning', location: targetUrl, detail: 'Missing <h1> heading on page' });
            }

            console.log(`  ✅ Successfully audited ${pageName} (Title: "${title}")`);
        } catch (err) {
            console.log(`  💥 Error auditing ${pageName}: ${err.message}`);
            const list = siteName === 'consumer' ? auditResults.consumer.issues : auditResults.admin.issues;
            list.push({ type: 'Page Load Error', location: targetUrl, detail: err.message });
        }
    }

    // --- CONSUMER SITE AUDIT ---
    const consumerPages = [
        { name: 'Home', path: '/' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Kits', path: '/kits' },
        { name: 'Kit Detail (Christmas)', path: '/catalog/christmas' },
        { name: 'Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Subscription', path: '/subscription' },
        { name: 'Signin', path: '/signin' },
        { name: 'Signup', path: '/signup' },
        { name: 'Forgot Password', path: '/forgot-password' },
        { name: 'Reset Password', path: '/reset-password' },
        { name: 'Verification', path: '/verification' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Return Policy', path: '/return-policy' },
        { name: 'Rental Agreement', path: '/rental-agreement' },
        { name: 'Accessibility', path: '/accessibility' },
        { name: 'Protected Account (Guard Check)', path: '/account' },
    ];

    for (const p of consumerPages) {
        await auditPage(`${CONSUMER_URL}${p.path}`, 'consumer', p.name);
    }

    // Test Consumer Signin form interactions
    console.log('\n🧪 Testing Consumer Signin Form Validation & Interactions...');
    await page.goto(`${CONSUMER_URL}/signin`);
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForTimeout(500);

    // --- ADMIN SITE AUDIT ---
    const adminPages = [
        { name: 'Admin Signin', path: '/signin' },
        { name: 'Admin Dashboard (Guard Check)', path: '/' },
        { name: 'Admin Holidays', path: '/holidays' },
        { name: 'Admin Kits', path: '/kits' },
        { name: 'Admin Inventory', path: '/inventory' },
        { name: 'Admin Orders', path: '/orders' },
        { name: 'Admin Returns', path: '/returns' },
        { name: 'Admin Subscriptions', path: '/subscriptions' },
        { name: 'Admin Plans', path: '/plans' },
        { name: 'Admin Users', path: '/users' },
        { name: 'Admin Reviews', path: '/reviews' },
        { name: 'Admin Settings', path: '/settings' },
    ];

    for (const p of adminPages) {
        await auditPage(`${ADMIN_URL}${p.path}`, 'admin', p.name);
    }

    await browser.close();

    // Write audit summary
    fs.writeFileSync(path.join(__dirname, 'audit_raw_results.json'), JSON.stringify(auditResults, null, 2));
    console.log('\n✨ Audit Complete! Raw results saved to frontend/audit_raw_results.json.');
})();
