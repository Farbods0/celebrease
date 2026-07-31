import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const MAX_RETRIES = 15;
  let success = false;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Checking deployment (Attempt ${i + 1}/${MAX_RETRIES})...`);
    // Need to go to a specific catalog page
    await page.goto('https://celebrease.com/catalog', { waitUntil: 'networkidle' });
    const firstHolidayHref = await page.evaluate(() => document.querySelector('.cb-holiday-card')?.getAttribute('href'));
    if (!firstHolidayHref) {
      console.log('Could not find holiday link.');
      await page.waitForTimeout(10000);
      continue;
    }
    
    await page.goto('https://celebrease.com' + firstHolidayHref, { waitUntil: 'networkidle' });
    
    const galleryImageCount = await page.$$eval('.cb-gallery-main img', imgs => imgs.length);
    const thumbsCount = await page.$$eval('.cb-gallery-thumbs button', btns => btns.length);
    
    if (galleryImageCount > 1 && galleryImageCount === thumbsCount) {
        console.log('✅ Deployment successful! Found all gallery images pre-rendered in the DOM.');
        success = true;
        break;
    } else {
        console.log(`Not yet updated (found ${galleryImageCount} images, expected ${thumbsCount}). Waiting 10 seconds before next check...`);
        await page.waitForTimeout(10000);
    }
  }
  
  if (!success) {
    console.error('❌ Deployment verification timed out. Changes not seen on live site.');
    process.exit(1);
  }
  
  await browser.close();
})();
