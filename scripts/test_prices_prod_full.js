const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } });
  
  await page.goto('https://celebrease.com/subscription');
  await page.waitForTimeout(2000);
  
  const yearlyBtnProd = await page.getByRole('button', { name: 'Yearly' });
  if (await yearlyBtnProd.isVisible()) {
    await yearlyBtnProd.click();
    await page.waitForTimeout(1000);
    // Take full page screenshot to ensure prices are visible
    await page.screenshot({ path: 'yearly_prices_prod_full.png', fullPage: true });
    console.log('Took full screenshot yearly_prices_prod_full.png');
  }
  
  await browser.close();
})();
