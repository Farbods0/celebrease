const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONSUMER_URL = 'https://celebrease.com';
const ADMIN_URL = 'https://admin.celebrease.com';

const report = {
    critical: [],
    major: [],
    minor: [],
    passed: [],
};

(async () => {
    console.log('🧪 Running Deep Production Regression Audit Suite...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Track console & network errors
    const consoleLogs = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleLogs.push(`[Console Error] ${msg.text()} at ${page.url()}`);
    });

    const networkFailures = [];
    page.on('response', res => {
        if (res.status() >= 400 && !res.url().includes('favicon') && !res.url().includes('google-analytics')) {
            networkFailures.push(`[HTTP ${res.status()}] ${res.url()} on ${page.url()}`);
        }
    });

    async function checkPage(url, pageName, category = 'consumer') {
        console.log(`Checking ${pageName} (${url})...`);
        try {
            const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
            await page.waitForTimeout(1000);

            if (!resp || resp.status() >= 400) {
                report.critical.push({ page: pageName, url, issue: `HTTP ${resp ? resp.status() : 'No response'}` });
                return;
            }

            // Check broken images
            const brokenImgs = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs
                    .filter(img => !img.complete || img.naturalWidth === 0 || img.src.includes('undefined') || img.src.includes('null'))
                    .map(img => img.src);
            });

            if (brokenImgs.length > 0) {
                report.major.push({ page: pageName, url, issue: `Broken images found (${brokenImgs.length}): ${brokenImgs.join(', ')}` });
            }

            // Check missing H1
            const h1Count = await page.locator('h1').count();
            if (h1Count === 0) {
                report.minor.push({ page: pageName, url, issue: 'Missing <h1> heading for accessibility/SEO' });
            }

            report.passed.push({ page: pageName, url });
        } catch (err) {
            report.major.push({ page: pageName, url, issue: `Page load failed/timed out: ${err.message}` });
        }
    }

    // 1. Consumer Public & Catalog Pages
    const consumerUrls = [
        { name: 'Homepage', path: '/' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Kits', path: '/kits' },
        { name: 'Christmas Kit Detail', path: '/catalog/christmas' },
        { name: 'Cart Page', path: '/cart' },
        { name: 'Checkout Page', path: '/checkout' },
        { name: 'Subscription Page', path: '/subscription' },
        { name: 'Signin Page', path: '/signin' },
        { name: 'Signup Page', path: '/signup' },
        { name: 'Forgot Password Page', path: '/forgot-password' },
        { name: 'Reset Password Page', path: '/reset-password' },
        { name: 'Verification Page', path: '/verification' },
        { name: 'About Page', path: '/about' },
        { name: 'Contact Page', path: '/contact' },
        { name: 'How It Works Page', path: '/how-it-works' },
        { name: 'FAQs Page', path: '/faqs' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Return Policy', path: '/return-policy' },
        { name: 'Rental Agreement', path: '/rental-agreement' },
        { name: 'Accessibility', path: '/accessibility' },
        { name: 'Protected Account Guard', path: '/account' },
    ];

    for (const item of consumerUrls) {
        await checkPage(`${CONSUMER_URL}${item.path}`, item.name, 'consumer');
    }

    // 2. Interactive Form Tests
    console.log('\nTesting Signin Form Validation...');
    await page.goto(`${CONSUMER_URL}/signin`);
    await page.waitForTimeout(500);
    // Click submit empty
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        const hasErr = await page.evaluate(() => document.body.innerText.includes('Enter your email') || document.body.innerText.includes('Password must be'));
        if (!hasErr) {
            report.minor.push({ page: 'Signin Page', url: `${CONSUMER_URL}/signin`, issue: 'Empty form submission did not trigger visible field validation message' });
        }
    }

    console.log('\nTesting Signup Form Validation...');
    await page.goto(`${CONSUMER_URL}/signup`);
    await page.waitForTimeout(500);
    const signupSubmitBtn = page.locator('button[type="submit"]').first();
    if (await signupSubmitBtn.isVisible()) {
        await signupSubmitBtn.click();
        await page.waitForTimeout(500);
    }

    // 3. Admin Site Pages & Guard Checks
    const adminUrls = [
        { name: 'Admin Signin', path: '/signin' },
        { name: 'Admin Dashboard', path: '/' },
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

    for (const item of adminUrls) {
        await checkPage(`${ADMIN_URL}${item.path}`, item.name, 'admin');
    }

    await browser.close();

    // Attach console & network errors
    if (consoleLogs.length > 0) {
        report.minor.push({ page: 'Global', url: 'Multiple', issue: `Console Errors detected (${consoleLogs.length}): ${consoleLogs.slice(0, 5).join('; ')}` });
    }
    if (networkFailures.length > 0) {
        report.major.push({ page: 'Global', url: 'Multiple', issue: `Failed HTTP Network Requests (${networkFailures.length}): ${networkFailures.slice(0, 5).join('; ')}` });
    }

    fs.writeFileSync(path.join(__dirname, 'regression_report_data.json'), JSON.stringify(report, null, 2));
    console.log('✅ Deep Audit Complete! Data written to frontend/regression_report_data.json.');
})();
