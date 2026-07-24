import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to https://celebrease.com...');
  const response = await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
  
  console.log(`Response Status: ${response?.status()}`);
  
  const title = await page.title();
  console.log(`Page Title: ${title}`);
  
  // Check for Next.js application error
  const hasAppError = await page.locator('text="Application error"').count() > 0;
  const hasServerError = await page.locator('text="Internal Server Error"').count() > 0;
  
  if (hasAppError || hasServerError) {
    console.log('❌ CRITICAL ERROR: Found an application crash or 500 error screen on production.');
  } else {
    console.log('✅ SUCCESS: No crash screens detected.');
  }
  
  // Try to find if holidays loaded
  const catalogLink = await page.locator('a[href="/catalog"]').first();
  if (await catalogLink.isVisible()) {
    console.log('Navigating to Catalog...');
    await catalogLink.click();
    await page.waitForLoadState('networkidle');
    
    // Check if we see the empty state or actual items
    const hasEmptyState = await page.locator('text="No holidays found"').count() > 0;
    if (hasEmptyState) {
        console.log('⚠️ WARNING: Catalog loaded, but it says "No holidays found" (Backend might still be unreachable or deploying).');
    } else {
        console.log('✅ SUCCESS: Catalog loaded and items appear to be present.');
    }
  }

  // Take a screenshot
  await page.screenshot({ path: 'production_screenshot.png' });
  console.log('Screenshot saved to production_screenshot.png');

  await browser.close();
})();
