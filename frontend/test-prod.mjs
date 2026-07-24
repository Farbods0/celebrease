import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let apiCallFailed = false;
  page.on('response', response => {
    if (!response.ok() && response.url().includes('/api/')) {
        apiCallFailed = true;
        console.log(`❌ Failed API Call: ${response.url()} (${response.status()})`);
    }
  });

  console.log('Navigating to https://celebrease.com...');
  try {
    const response = await page.goto('https://celebrease.com', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Response Status: ${response?.status()}`);
    
    if (apiCallFailed) {
        console.log('❌ CRITICAL ERROR: Found failing API calls on production.');
    }
    
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    await browser.close();
  }
})();
