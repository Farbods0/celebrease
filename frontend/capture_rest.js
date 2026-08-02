const { chromium } = require('playwright');
const fs = require('fs');

const routes = [
    "/subscription",
    "/catalog/christmas",
    "/cart",
    "/signin",
    "/signup",
    "/account"
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  for (const route of routes) {
    const page = await context.newPage();
    const url = `https://celebrease.com${route}`;
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      const fileName = route.replace(/\//g, "_").substring(1);
      const path = `screenshots/${fileName}.png`;
      await page.screenshot({ path: path, fullPage: true });
      console.log(`Saved screenshot to ${path}`);
    } catch (e) {
      console.log(`Failed to capture ${url}: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("Captured remaining pages.");
})();
