const { chromium } = require('playwright');
const crypto = require('crypto');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log("Navigating to production site to test tab performance...");
  
  try {
      const email = `test_${crypto.randomBytes(4).toString('hex')}@celebrease.com`;
      const pass = "Password123!";
      
      console.log("Attempting to sign up with", email);
      await page.goto('https://celebrease.com/signup');
      await page.fill('#cb-firstName', 'Test');
      await page.fill('#cb-lastName', 'User');
      await page.fill('#cb-email', email);
      await page.fill('#cb-password', pass);
      await page.fill('#cb-confirmPassword', pass);
      // Click the button representing the Radix UI checkbox
      await page.waitForSelector('label.cb-auth-terms-row');
      await page.click('label.cb-auth-terms-row');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(5000);
      
      console.log("Current URL:", page.url());
      if (page.url().includes('verification')) {
          console.log("Setting emailVerified = true in database...");
          const execSync = require('child_process').execSync;
          const fs = require('fs');
          const scriptContent = `
const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
  });
  await client.connect();
  await client.query("UPDATE \\"User\\" SET \\"emailVerified\\" = true WHERE email = $1", ['${email}']);
  await client.end();
}
main().catch(console.error);
`;
          fs.writeFileSync('backend/verify_user.js', scriptContent);
          execSync('node verify_user.js', { cwd: './backend' });
          
          console.log("Logging in again...");
          await page.goto('https://celebrease.com/login');
          await page.fill('input[type="email"]', email);
          await page.fill('input[type="password"]', pass);
          await page.click('button[type="submit"]');
          await page.waitForTimeout(3000);
          
          await page.goto('https://celebrease.com/account');
          await page.waitForSelector('.acct-nav-link');
          
          console.log("Measuring tab click latency...");
          const startTime = Date.now();
          // Click the 'Orders' tab
          const tabs = await page.$$('.acct-nav-link');
          await tabs[3].click();
          
          // Wait for the active class to appear on the clicked tab
          await page.waitForSelector('.acct-nav-link.active', { state: 'attached' });
          const endTime = Date.now();
          console.log(`Tab click to UI reaction took: ${endTime - startTime}ms`);
      }
  } catch (err) {
      console.error("Test failed:", err.message);
  } finally {
      await browser.close();
  }
})();
