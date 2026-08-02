const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🔍 Executing Deep Interactive Flow Tests...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const findings = [];

    // --- TEST 1: Add to Cart & Checkout Flow ---
    console.log('\n[TEST 1] Add to Cart & Drawer Flow...');
    await page.goto('https://celebrease.com/catalog/christmas', { waitUntil: 'networkidle' });

    // Look for Add to Cart button
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Rent Now"), button:has-text("Subscribe")').first();
    if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);

        // Check if cart updated or redirected
        const cartBadge = page.locator('.cart-count, .cb-cart-count, [data-cart-count]');
        const cartCountText = await cartBadge.textContent().catch(() => '');
        console.log(`  Cart Badge Text: "${cartCountText.trim()}"`);

        // Check /cart page
        await page.goto('https://celebrease.com/cart', { waitUntil: 'networkidle' });
        const cartText = await page.innerText('body');
        if (cartText.includes('Your cart is empty')) {
            findings.push({ severity: 'Major', component: 'Cart Flow', description: 'Clicking Add to Cart on product detail page did not persist item to cart page.' });
        } else {
            console.log('  ✅ Item successfully added to cart and visible on /cart page!');
        }
    } else {
        findings.push({ severity: 'Minor', component: 'Product Page', description: 'Could not locate explicit Add to Cart button on /catalog/christmas.' });
    }

    // --- TEST 2: Signup Password Mismatch Validation ---
    console.log('\n[TEST 2] Signup Password Mismatch Validation...');
    await page.goto('https://celebrease.com/signup', { waitUntil: 'networkidle' });
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');

    // Check if password match error is displayed
    const bodyText = await page.innerText('body');
    if (!bodyText.includes('match') && !bodyText.includes('do not match')) {
        // Try submitting form to see if error triggers
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible()) await submitBtn.click();
        await page.waitForTimeout(500);

        const textAfterSubmit = await page.innerText('body');
        if (!textAfterSubmit.includes('match') && !textAfterSubmit.includes('do not match') && !textAfterSubmit.includes('Match')) {
            findings.push({ severity: 'Minor', component: 'Signup Form', description: 'Confirm password mismatch did not trigger immediate inline validation error.' });
        }
    }

    // --- TEST 3: Navigation Header & Footer Links ---
    console.log('\n[TEST 3] Navigation Links & Footer Check...');
    await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
    const footerLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('footer a, header a'));
        return links.map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim() }));
    });

    const brokenLinks = footerLinks.filter(l => !l.href || l.href === '#' || l.href.includes('undefined'));
    if (brokenLinks.length > 0) {
        findings.push({ severity: 'Minor', component: 'Navigation Header/Footer', description: `Found ${brokenLinks.length} placeholder/broken links: ${JSON.stringify(brokenLinks)}` });
    } else {
        console.log(`  ✅ All ${footerLinks.length} header/footer links have valid destinations.`);
    }

    await browser.close();

    fs.writeFileSync('frontend/interactive_findings.json', JSON.stringify(findings, null, 2));
    console.log('\n✨ Deep Interactive Tests Complete! Findings saved to frontend/interactive_findings.json');
})();
