const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let allGood = true;

  try {
    // 1. Check Home
    console.log("Checking /...");
    await page.goto('https://celebrease.com');
    // We check the specific class `.cb-testi-attr` to see if it starts with `- Sarah M., Chicago`
    const testiAttrs = await page.locator('.cb-testi-attr').allInnerTexts();
    if (testiAttrs.some(text => text.includes(', Sarah M'))) {
      console.log("❌ Home still has leading comma.");
      allGood = false;
    } else if (testiAttrs.some(text => text.includes('- Sarah M'))) {
      console.log("✅ Home has correct author attribution.");
    } else {
      console.log("❌ Home did not find Sarah M.");
      allGood = false;
    }

    // 2. Check FAQs
    console.log("Checking /faqs...");
    await page.goto('https://celebrease.com/faqs');
    const faqBtns = await page.locator('.btn-fill-grad').allInnerTexts();
    if (faqBtns.some(text => text.includes('✉ Send a Message') || text.includes('✉Send a Message') || text.includes('✉\nSend a Message'))) {
      console.log("✅ FAQs has the correct envelope icon layout.");
    } else {
      console.log("❌ FAQs does not have the envelope icon in text. Found: ", faqBtns);
      allGood = false;
    }

    // 3. Check How It Works
    console.log("Checking /how-it-works...");
    await page.goto('https://celebrease.com/how-it-works');
    const hiwText = await page.innerText('body');
    if (hiwText.includes('10, 25 designer-picked')) {
      console.log("❌ How It Works still has typo.");
      allGood = false;
    } else if (hiwText.includes('10-25 designer-picked')) {
      console.log("✅ How It Works has correct typography.");
    } else {
      console.log("❌ How It Works did not find the text at all.");
      allGood = false;
    }

    // 4. Check About images (Network tracking)
    console.log("Checking /about...");
    
    const failedImages = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        failedImages.push(response.url());
      }
    });
    
    await page.goto('https://celebrease.com/about', { waitUntil: 'networkidle' });
    
    if (failedImages.length > 0) {
      console.log(`❌ About page has ${failedImages.length} broken images:`, failedImages);
      allGood = false;
    } else {
      console.log("✅ About page images all loaded successfully (200 OK).");
    }

    if (allGood) {
      console.log("PRODUCTION VERIFICATION SUCCESSFUL: UI changes are live.");
    } else {
      console.log("PRODUCTION VERIFICATION FAILED: UI changes are not yet live or incorrect.");
    }
  } catch (error) {
    console.error("Playwright error:", error);
  } finally {
    await browser.close();
  }
})();
