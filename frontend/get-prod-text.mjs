import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const response = await page.goto('https://celebrease.com');
  console.log('Status:', response.status());
  
  // get innerText of body
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body Text:');
  console.log(bodyText.substring(0, 1000));

  await browser.close();
})();
