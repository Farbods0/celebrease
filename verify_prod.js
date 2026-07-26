const { chromium } = require('playwright');
const crypto = require('crypto');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Create a random test user
  const email = `test_${crypto.randomBytes(4).toString('hex')}@example.com`;
  const password = "Password123!";

  console.log("Navigating to http://localhost:4000/signup");
  await page.goto('http://localhost:4000/signup', { waitUntil: 'networkidle' });

  console.log(`Signing up as ${email}...`);
  await page.fill('#cb-firstName', 'Test');
  await page.fill('#cb-lastName', 'User');
  await page.fill('#cb-email', email);
  await page.fill('#cb-password', password);
  await page.fill('#cb-confirmPassword', password);
  await page.click('button[role="checkbox"]'); // The Checkbox component usually has role="checkbox"
  
  
  // Submit the signup form
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard or /subscription
  console.log("Waiting for signup to complete...");
  await page.waitForURL('**/subscription**', { timeout: 15000 }).catch(async () => {
      // Sometimes it redirects to /dashboard instead of /subscription
      console.log("Did not redirect to /subscription, going there manually");
      await page.goto('http://localhost:4000/subscription', { waitUntil: 'networkidle' });
  });

  console.log("Clicking plan button...");
  // Now we are on /subscription and logged in.
  // Wait for the PlansGrid to load the buttons
  const planCardBtn = page.locator('.cb-plan-card button').first();
  await planCardBtn.waitFor({ state: 'visible', timeout: 10000 });
  await planCardBtn.click();
  
  console.log("Waiting for navigation to checkout.stripe.com...");
  await page.waitForURL('**/checkout.stripe.com/**', { timeout: 15000 });
  
  const currentUrl = page.url();
  console.log("Success! Reached Stripe Checkout URL:", currentUrl);
  
  await browser.close();
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
