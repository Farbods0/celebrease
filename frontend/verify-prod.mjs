import { chromium } from '@playwright/test';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to https://celebrease.com...');
  try {
    const response = await page.goto('https://celebrease.com', { waitUntil: 'networkidle', timeout: 30000 });
    
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
    
    // Check if we see the empty state or actual items
    const hasEmptyState = await page.locator('text="No holidays found"').count() > 0;
    const hasItems = await page.locator('.catalog-section').count() > 0 || await page.locator('h1').count() > 0;
    if (hasEmptyState) {
        console.log('⚠️ WARNING: The site loaded, but it says "No holidays found" (Backend might still be unreachable or deploying).');
    } else if (hasItems) {
        console.log('✅ SUCCESS: Site loaded and elements appear to be present.');
    } else {
        console.log('⚠️ UNKNOWN: Could not find catalog items or empty state, but site did not crash.');
    }

    // Take a screenshot
    await page.screenshot({ path: 'production_screenshot.png' });
    console.log('Screenshot saved to production_screenshot.png');
  } catch (error) {
    console.error('Failed to load celebrease.com:', error);
  } finally {
    await browser.close();
  }
})();
