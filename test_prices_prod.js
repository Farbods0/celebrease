const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to celebrease.com');
  await page.goto('https://celebrease.com/subscription');
  await page.waitForTimeout(2000); // wait for plans to render
  
  console.log('Looking for Yearly button');
  const yearlyBtnProd = await page.getByRole('button', { name: 'Yearly' });
  if (await yearlyBtnProd.isVisible()) {
    await yearlyBtnProd.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'yearly_prices_prod.png' });
    console.log('Took screenshot yearly_prices_prod.png on celebrease.com');
  } else {
    console.log('Yearly button not found on celebrease.com/subscription');
  }
  
  await browser.close();
})();
