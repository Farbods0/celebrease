const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let deployed = false;
  let attempts = 0;
  
  while (!deployed && attempts < 20) {
    attempts++;
    console.log(`Attempt ${attempts}: Checking live site...`);
    try {
      await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
      // The images might be in the catalog or events section. 
      // Let's directly request one of the raw images.
      const response = await page.request.get("https://celebrease.com/events/New%20Year's.png");
      if (response.ok()) {
          const buffer = await response.body();
          // The new image size is around 259KB (from earlier list_dir). The old one was 202KB.
          // Or we can check if it's the new JPEG image format. 
          // A JPEG file starts with FF D8 FF
          if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
              console.log("SUCCESS: New JPEG image is live on production!");
              deployed = true;
          } else {
              console.log("Image is still the old PNG. Waiting...");
          }
      }
    } catch (e) {
      console.log(`Error checking: ${e.message}`);
    }
    
    if (!deployed) {
        await new Promise(r => setTimeout(r, 15000)); // wait 15 seconds
    }
  }

  if (deployed) {
      await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
      await page.screenshot({ path: 'live_production_screenshot.png', fullPage: true });
      console.log("Screenshot taken of the live production site.");
  } else {
      console.log("Deployment did not seem to complete in time.");
  }

  await browser.close();
})();
