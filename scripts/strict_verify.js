const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const MAX_RETRIES = 20;
  let success = false;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`\nChecking live deployment (Attempt ${i + 1}/${MAX_RETRIES})...`);
    await page.goto('https://celebrease.com/subscription', { waitUntil: 'networkidle' });
    
    // Wait for the green labels to appear
    await page.waitForSelector('.text-green-600', { state: 'visible', timeout: 10000 });
    const texts = await page.locator('.text-green-600').allTextContents();
    
    console.log('Current rendered green text labels:', texts);
    
    // Ensure we found some texts and ALL of them say EXACTLY 'Billed monthly' without duplicate words
    const allClean = texts.length > 0 && texts.every(t => t.trim() === 'Billed monthly');
    
    if (allClean) {
        console.log('✅ Deployment is completely LIVE! All labels read exactly "Billed monthly".');
        
        // Let's test toggling to Yearly
        const yearlyToggle = await page.getByRole('tab', { name: 'Yearly' }).or(page.getByText('Yearly')).first();
        if (yearlyToggle) {
            await yearlyToggle.click();
            await page.waitForTimeout(1000);
            const yearlyTexts = await page.locator('.text-green-600').allTextContents();
            console.log('Yearly toggled green text labels:', yearlyTexts);
            
            if (yearlyTexts.every(t => t.includes('discount applied') || t.includes('yearly'))) {
                console.log('✅ Yearly pricing displays properly discounted text!');
                success = true;
                break;
            }
        }
    } else {
        console.log('Server still serving older bundle ("Billed Billed"). Waiting 20 seconds before next retry...');
    }
    
    await page.waitForTimeout(20000);
  }
  
  if (!success) {
    console.error('❌ Verification failed or timed out.');
    process.exit(1);
  }
  
  await browser.close();
})();
