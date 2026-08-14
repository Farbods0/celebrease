const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log("Starting UX Evaluation Script...");
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  try {
    // Helper to scroll down page to trigger lazy loading
    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 500;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 200);
        });
      });
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000); // Wait a moment for final renders
    }

    // 1. Homepage
    console.log("Navigating to Homepage...");
    await page.goto('https://celebrease.com', { waitUntil: 'networkidle' });
    await autoScroll(page);
    await page.screenshot({ path: 'ux_home.png', fullPage: true });
    
    // Check main CTA
    const hasCatalogLink = await page.locator('a[href="/shop-kits"]').count() > 0;
    console.log(`Homepage has catalog CTA: ${hasCatalogLink}`);
    
    // 2. Catalog
    console.log("Navigating to Catalog...");
    await page.click('a[href="/shop-kits"]');
    await page.waitForURL('**/shop-kits');
    await autoScroll(page);
    await page.screenshot({ path: 'ux_catalog.png', fullPage: true });
    
    // Check if skeletons or products loaded
    const productCount = await page.locator('.cb-holiday-card').count();
    console.log(`Catalog loaded with ${productCount} holiday cards`);
    
    // 3. Holiday Detail
    console.log("Clicking on first holiday kit...");
    await page.locator('.cb-holiday-card').first().click();
    await autoScroll(page);
    await page.screenshot({ path: 'ux_holiday.png', fullPage: true });
    
    // Find Add to Cart button
    const addToCartBtns = await page.locator('button:has-text("Add to Cart")').count();
    console.log(`Holiday detail has Add to Cart buttons: ${addToCartBtns}`);
    
    // Click Add to Cart
    if (addToCartBtns > 0) {
      console.log("Clicking Add to Cart...");
      await page.locator('button:has-text("Add to Cart")').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'ux_cart.png', fullPage: true });
    }
    
    console.log("UX flow completed successfully.");
  } catch (error) {
    console.error("Error during UX flow:", error);
  } finally {
    await browser.close();
  }
})();
