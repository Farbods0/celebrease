const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const MAX_RETRIES = 10;
  let success = false;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Checking deployment (Attempt ${i + 1}/${MAX_RETRIES})...`);
    await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });
    
    // Check if the "Billed monthly" label is present in the DOM.
    // It should replace "Billed $X/year" when Monthly is selected.
    const textContent = await page.content();
    if (textContent.includes('Billed monthly')) {
        console.log('✅ Deployment successful! Found "Billed monthly" on the live site.');
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
