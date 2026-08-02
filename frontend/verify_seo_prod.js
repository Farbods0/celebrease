const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let allGood = true;

  try {
    // Check robots.txt
    console.log("Checking https://celebrease.com/robots.txt...");
    const robotsResponse = await page.goto('https://celebrease.com/robots.txt');
    if (robotsResponse.status() !== 200) {
      console.log(`❌ robots.txt returned status ${robotsResponse.status()}`);
      allGood = false;
    } else {
      const robotsText = await robotsResponse.text();
      if (!robotsText.includes('sitemap.xml')) {
        console.log("❌ robots.txt does not contain sitemap.xml reference");
        allGood = false;
      } else {
        console.log("✅ robots.txt is valid.");
      }
    }

    // Check sitemap.xml
    console.log("Checking https://celebrease.com/sitemap.xml...");
    const sitemapResponse = await page.goto('https://celebrease.com/sitemap.xml');
    if (sitemapResponse.status() !== 200) {
      console.log(`❌ sitemap.xml returned status ${sitemapResponse.status()}`);
      allGood = false;
    } else {
      const sitemapText = await sitemapResponse.text();
      if (!sitemapText.includes('celebrease.com')) {
        console.log("❌ sitemap.xml does not contain correct URLs");
        allGood = false;
      } else {
        console.log("✅ sitemap.xml is valid.");
      }
    }

    if (allGood) {
      console.log("PRODUCTION VERIFICATION SUCCESSFUL: SEO changes are live.");
    } else {
      console.log("PRODUCTION VERIFICATION FAILED: SEO changes are not yet live or incorrect.");
    }
  } catch (error) {
    console.error("Playwright error:", error);
  } finally {
    await browser.close();
  }
})();
