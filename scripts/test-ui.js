const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:4000/subscription', { waitUntil: 'networkidle' });
    
    // Check if the pricing grid exists
    const gridExists = await page.locator('.plans-grid-wrap').isVisible();
    console.log('Pricing Grid Exists:', gridExists);

    // Wait for the plan cards to be visible
    await page.waitForSelector('.cb-plan-price', { timeout: 10000 }).catch(() => console.log('Timeout waiting for .cb-plan-price'));

    // Extract text from the page
    const bodyText = await page.locator('body').innerText();
    
    if (bodyText.includes('Billed annually')) {
      console.log('✅ Found "Billed annually" text');
    } else {
      console.log('❌ "Billed annually" text NOT found. It still says something else.');
      if (bodyText.includes('Billed monthly')) console.log('❌ Found "Billed monthly" text instead.');
    }

    if (bodyText.includes('$199/year')) {
      console.log('✅ Found "$199/year" text');
    } else {
      console.log('❌ "$199/year" text NOT found. It still says something else.');
      if (bodyText.includes('$199/month')) console.log('❌ Found "$199/month" text instead.');
    }

    if (bodyText.includes('Monthly') && bodyText.includes('Yearly')) {
      console.log('❌ Toggle is still present on the page.');
    } else {
      console.log('✅ Toggle is NOT present.');
    }

    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('Screenshot saved as test-screenshot.png');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
