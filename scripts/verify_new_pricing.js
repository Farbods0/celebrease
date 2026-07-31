const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const MAX_RETRIES = 12;
  let success = false;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Checking live deployment (Attempt ${i + 1}/${MAX_RETRIES})...`);
    await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });
    
    const textContent = await page.content();
    
    // Check if the shameful "Billed Billed" is completely eradicated
    const hasTypo = textContent.includes('Billed Billed');
    const hasProperMonthly = textContent.includes('Billed monthly');
    
    if (!hasTypo && hasProperMonthly) {
        console.log('✅ Deployment successful! "Billed Billed" is totally gone, proper "Billed monthly" is rendered.');
        
        // Let's also check if toggling to Yearly works as expected
        const yearlyToggle = await page.getByRole('tab', { name: 'Yearly' }).or(page.getByText('Yearly')).first();
        if (yearlyToggle) {
            await yearlyToggle.click();
            await page.waitForTimeout(500);
            const newContent = await page.content();
            if (newContent.includes('discount applied') || newContent.includes('/year')) {
                console.log('✅ Yearly toggle correctly displays total yearly pricing and discount info!');
                success = true;
                break;
            } else {
                console.log('Yearly text not found after clicking toggle, waiting...');
            }
        } else {
            console.log('Could not click Yearly button...');
        }
    } else {
        console.log('Not yet updated on CDN/server. Waiting 15 seconds before next retry...');
    }
    
    await page.waitForTimeout(15000);
  }
  
  if (!success) {
    console.error('❌ Deployment verification timed out. Changes not yet reflected on live site.');
    process.exit(1);
  }
  
  await browser.close();
})();
