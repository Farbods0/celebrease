const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4000'); // Assuming local frontend runs on 4000
  // wait for the plans to load
  await page.waitForTimeout(2000);
  
  // click the yearly toggle
  const yearlyBtn = await page.getByRole('button', { name: 'Yearly' });
  if (await yearlyBtn.isVisible()) {
    await yearlyBtn.click();
    await page.waitForTimeout(1000);
    // take screenshot
    await page.screenshot({ path: 'yearly_prices.png' });
    console.log('Took screenshot yearly_prices.png');
  } else {
    console.log('Yearly button not found on localhost:4000. Trying celebrease.com');
    await page.goto('https://celebrease.com');
    await page.waitForTimeout(2000);
    const yearlyBtnProd = await page.getByRole('button', { name: 'Yearly' });
    if (await yearlyBtnProd.isVisible()) {
      await yearlyBtnProd.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'yearly_prices.png' });
      console.log('Took screenshot yearly_prices.png on celebrease.com');
    }
  }
  await browser.close();
})();
