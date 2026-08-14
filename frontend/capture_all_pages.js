const { chromium } = require('playwright');
const fs = require('fs');

const routes = [
    "",
    "/about",
    "/shop-kits",
    "/contact",
    "/faqs",
    "/how-it-works"
];
// We will focus on the main visual pages rather than just text heavy legal pages for the core UX audit.
// But let's add a product detail page if we can find a link in catalog, or just capture these core ones.

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
  }

  for (const route of routes) {
    const page = await context.newPage();
    const url = `https://celebrease.com${route}`;
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      // Wait an extra second for animations to settle
      await page.waitForTimeout(1000);
      
      const fileName = route === "" ? "home" : route.replace(/\//g, "_").substring(1);
      const path = `screenshots/${fileName}.png`;
      await page.screenshot({ path: path, fullPage: true });
      console.log(`Saved screenshot to ${path}`);
    } catch (e) {
      console.log(`Failed to capture ${url}: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("All screenshots captured.");
})();
