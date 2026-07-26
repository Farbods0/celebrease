const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const desktopPath = '/Users/farbodjahan/Desktop/Celebrease_Images_Review';
if (!fs.existsSync(desktopPath)) {
    fs.mkdirSync(desktopPath, { recursive: true });
}

const holidays = [
    { name: 'Christmas', query: 'christmas living room decor' },
    { name: 'New_Years', query: 'new years eve party table' },
    { name: 'Ramadan', query: 'ramadan lantern decor interior' },
    { name: 'Diwali', query: 'diwali diyas decoration' },
    { name: 'Birthdays', query: 'birthday party table balloons' },
    { name: 'Valentines_Day', query: 'valentines day romantic dinner table' },
    { name: 'Baby_Showers', query: 'baby shower decoration party' }
];

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

(async () => {
    console.log('Starting Unsplash scraper...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const holiday of holidays) {
        console.log(`Searching for: ${holiday.name} (${holiday.query})`);
        const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(holiday.query)}`;
        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000); // let images load

            // Find high-res image URLs
            const imgUrls = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs
                    .map(img => img.src)
                    .filter(src => src && src.includes('images.unsplash.com/photo') && src.includes('w='))
                    .map(src => {
                        // strip query params to get a higher res or just use 1080w
                        const urlObj = new URL(src);
                        urlObj.searchParams.set('w', '1080');
                        return urlObj.toString();
                    });
            });

            // unique URLs
            const uniqueUrls = [...new Set(imgUrls)].slice(0, 3); // Get top 3 images

            for (let i = 0; i < uniqueUrls.length; i++) {
                const dest = path.join(desktopPath, `${holiday.name}_Option_${i + 1}.jpg`);
                console.log(`Downloading ${dest}...`);
                await downloadImage(uniqueUrls[i], dest);
            }
        } catch (e) {
            console.error(`Failed to scrape ${holiday.name}:`, e.message);
        }
    }

    await browser.close();
    console.log('Done!');
})();
