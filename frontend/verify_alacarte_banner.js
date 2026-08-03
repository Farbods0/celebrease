const { chromium } = require('playwright');

(async () => {
  console.log("Capturing live subscription page A La Carte banner...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshots_live_verification/subscription_alacarte.png', fullPage: true });
  console.log("Saved screenshots_live_verification/subscription_alacarte.png");

  await browser.close();
})();
