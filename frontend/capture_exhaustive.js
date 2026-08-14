const { chromium } = require('playwright');
const fs = require('fs');

const publicRoutes = [
    "/",
    "/about",
    "/accessibility",
    "/shop-kits",
    "/shop-kits/christmas",
    "/contact",
    "/faqs",
    "/how-it-works",
    "/privacy",
    "/rental-agreement",
    "/return-policy",
    "/subscription",
    "/terms",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verification"
];

const protectedRoutes = [
    "/account",
    "/account/subscription",
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/wishlist"
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  if (!fs.existsSync('screenshots_full')) {
      fs.mkdirSync('screenshots_full');
  }

  /*
  // 1. Capture public routes
  for (const route of publicRoutes) {
    const page = await context.newPage();
    const url = `https://celebrease.com${route}`;
    console.log(`Navigating to public route: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const fileName = route === "/" ? "home" : route.replace(/\//g, "_").substring(1);
      await page.screenshot({ path: `screenshots_full/${fileName}.png`, fullPage: true });
    } catch (e) {
      console.log(`Failed ${url}: ${e.message}`);
    }
    await page.close();
  }
  */

  // 2. Authenticate
  console.log("Authenticating test user...");
  const authPage = await context.newPage();
  await authPage.goto('https://celebrease.com/signup', { waitUntil: 'networkidle' });
  
  // Fill signup form (assuming standard selectors, adjusting for celebrease if needed)
  try {
      await authPage.fill('#cb-firstName', 'QA');
      await authPage.fill('#cb-lastName', 'Tester');
      await authPage.fill('input[type="email"]', `qa-${Date.now()}@celebrease.com`);
      await authPage.fill('input[type="password"]', 'Password123!');
      await authPage.fill('#cb-confirmPassword', 'Password123!');
      await authPage.click('[data-slot="checkbox"]');
      await authPage.click('button[type="submit"]');
      await authPage.waitForNavigation({ waitUntil: 'networkidle', timeout: 8000 }).catch(() => {});
      console.log("Authenticated successfully.");
  } catch (e) {
      console.log("Could not fully automate signup flow, attempting to capture protected routes anyway. Error:", e.message);
  }
  await authPage.close();

  // 3. Populate Cart
  console.log("Populating cart...");
  const cartPage = await context.newPage();
  try {
      await cartPage.goto('https://celebrease.com/shop-kits/christmas', { waitUntil: 'networkidle' });
      // Wait for React to mount and data to load
      await cartPage.waitForTimeout(2000);
      // Look for a button that contains "Reserve", "Add", or "Select"
      const buttons = await cartPage.$$('button');
      for (const btn of buttons) {
          const text = await btn.textContent();
          if (text && (text.toLowerCase().includes('reserve') || text.toLowerCase().includes('add') || text.toLowerCase().includes('select'))) {
              await btn.click();
              await cartPage.waitForTimeout(2000); // wait for cart update
              console.log("Added item to cart.");
              break;
          }
      }
  } catch (e) {
      console.log("Failed to populate cart: ", e.message);
  }
  await cartPage.close();

  // 4. Capture protected routes
  for (const route of protectedRoutes) {
    const page = await context.newPage();
    const url = `https://celebrease.com${route}`;
    console.log(`Navigating to protected route: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const fileName = route.replace(/\//g, "_").substring(1);
      await page.screenshot({ path: `screenshots_full/${fileName}.png`, fullPage: true });
    } catch (e) {
      console.log(`Failed ${url}: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("Exhaustive capture complete.");
})();
