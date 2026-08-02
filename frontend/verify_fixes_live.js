const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://celebrease.com';
const QA_EMAIL = process.env.QA_EMAIL || 'farbod.j.jahan@gmail.com';
const QA_PASSWORD = process.env.QA_PASSWORD || 'Expecla2*';

(async () => {
  console.log("Starting Live Production Fix Verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  if (!fs.existsSync('screenshots_live_verification')) {
    fs.mkdirSync('screenshots_live_verification');
  }

  // 1. Sign in
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/signin`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', QA_EMAIL);
  await page.fill('input[type="password"]', QA_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log("Authenticated. Current URL:", page.url());

  // 2. Verify /wishlist
  console.log("Verifying /wishlist images...");
  await page.goto(`${BASE_URL}/wishlist`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots_live_verification/wishlist.png', fullPage: true });

  // 3. Verify /faqs pill layout
  console.log("Verifying /faqs pill layout...");
  await page.goto(`${BASE_URL}/faqs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots_live_verification/faqs.png', fullPage: true });

  // 4. Verify /account/subscription payment method card empty state
  console.log("Verifying /account/subscription empty card state...");
  await page.goto(`${BASE_URL}/account/subscription`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots_live_verification/account_subscription.png', fullPage: true });

  // 5. Populate cart & verify /cart deposit styling
  console.log("Populating cart & verifying /cart deposit text...");
  await page.goto(`${BASE_URL}/catalog/christmas`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const addBtn = await page.$('button:has-text("Add to Cart"), button:has-text("Reserve")');
  if (addBtn) {
    await addBtn.click();
    await page.waitForTimeout(2000);
  }
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots_live_verification/cart.png', fullPage: true });

  // 6. Verify /checkout delivery ETA copy & thumbnail resolution
  console.log("Verifying /checkout delivery ETA & thumbnail...");
  await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots_live_verification/checkout.png', fullPage: true });

  await browser.close();
  console.log("Live Production Fix Verification complete.");
})();
