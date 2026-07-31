const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const MAX_RETRIES = 15;
  let success = false;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Checking deployment (Attempt ${i + 1}/${MAX_RETRIES})...`);
    await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
    
    // Check if the images on the catalog page have a sizes attribute
    // The previous version had raw <img> without sizes. Our updated version adds sizes="(max-width: 720px) 100vw..."
    const imagesWithSizes = await page.$$eval('.cb-holiday-card img', imgs => imgs.filter(img => img.hasAttribute('sizes')).length);
    
    if (imagesWithSizes > 0) {
        console.log('✅ Deployment successful! Found optimized Next.js Images on the live site.');
        success = true;
        break;
    } else {
        console.log('Not yet updated. Waiting 20 seconds before next check...');
        await page.waitForTimeout(20000);
    }
  }
  
  if (!success) {
    console.error('❌ Deployment verification timed out. Changes not seen on live site.');
    process.exit(1);
  }
  
  await browser.close();
})();
