const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to admin signin...');
  await page.goto('https://admin.celebrease.com/signin');
  await page.fill('input[name="email"]', 'farbods0@gmail.com');
  await page.fill('input[name="password"]', 'Admin123!@#');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log('Navigating to users page...');
  await page.goto('https://admin.celebrease.com/users');
  await page.waitForTimeout(3000);

  console.log('Current URL:', page.url());

  const qaTesterRow = page.locator('tr:has-text("QA Tester")');
  const count = await qaTesterRow.count();
  console.log('QA Tester rows found:', count);

  if (count > 0) {
    const deleteBtn = page.locator('tr:has-text("QA Tester") button[title="Delete user"], tr:has-text("QA Tester") button:has-text("Delete")');
    if (await deleteBtn.count() > 0) {
      console.log('Clicking delete button...');
      await deleteBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  const hasQa = await page.locator('text=QA Tester').count();
  console.log('QA Tester present after delete attempt:', hasQa);

  await page.screenshot({ path: 'C:/Users/farbo/Documents/celebrease/frontend/screenshots/users_result.png', fullPage: true });
  await browser.close();
})();
