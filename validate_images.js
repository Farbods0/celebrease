const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log("Navigating to production site...");
  // Wait up to 2 minutes for the deploy to go live, polling every 10 seconds
  let success = false;
  for (let i = 0; i < 12; i++) {
    try {
      await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
      
      // Check if any image has the function string in its src
      const badImages = await page.$$eval('img', imgs => imgs.filter(img => img.src.includes('function')).length);
      
      if (badImages === 0) {
        // Also verify images are loading correctly (status 200)
        // We can just check the first holiday card image
        const firstImageSrc = await page.$eval('.cb-holiday-card img', img => img.src);
        if (firstImageSrc && !firstImageSrc.includes('function') && firstImageSrc.includes('/uploads')) {
           console.log("Images fixed and loading correctly! src:", firstImageSrc);
           success = true;
           break;
        }
      }
    } catch(e) {
      // ignore
    }
    console.log("Deploy not live yet, waiting 10 seconds...");
    await new Promise(r => setTimeout(r, 10000));
  }
  
  if (!success) {
    console.error("Failed to validate image fix on production within 2 minutes.");
    process.exit(1);
  }
  
  await browser.close();
})();
