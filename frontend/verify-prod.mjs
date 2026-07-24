import { chromium } from '@playwright/test';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let failedImages = 0;
  page.on('response', response => {
    if (!response.ok() && response.request().resourceType() === 'image') {
      console.log(`❌ Failed image: ${response.url()} (${response.status()})`);
      failedImages++;
    }
  });

  console.log('Navigating to https://celebrease.com...');
  try {
    const response = await page.goto('https://celebrease.com', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Response Status: ${response?.status()}`);
    
    // Check for Next.js application error
    const hasAppError = await page.locator('text="Application error"').count() > 0;
    if (hasAppError) {
      console.log('❌ CRITICAL ERROR: Found an application crash.');
    } else {
      console.log('✅ SUCCESS: No crash screens detected.');
    }
    
    // Log all image src attributes on the page
    const imageSrcs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.src);
    });
    console.log('Image Sources on page:', imageSrcs);
    
    console.log(`Failed Images Count: ${failedImages}`);
  } catch (error) {
    console.error('Failed to load celebrease.com:', error);
  } finally {
    await browser.close();
  }
})();
