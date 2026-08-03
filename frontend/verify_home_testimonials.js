const { chromium } = require('playwright');

(async () => {
  console.log("Capturing live home page testimonials section...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const section = await page.$('.cb-testimonials');
  if (section) {
    await section.screenshot({ path: 'screenshots_live_verification/living_rooms_everywhere.png' });
    console.log("Saved screenshots_live_verification/living_rooms_everywhere.png");
  } else {
    console.log(".cb-testimonials section not found!");
  }

  await browser.close();
})();
