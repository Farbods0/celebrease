const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// Hardcoded IDs from photo_gen_task.md for specific ones
const specialIds = {
    "New Year's Eve": { "STARTER": "ny_std", "PREMIUM": "ny_prem" },
    "Ramadan": { "STARTER": "ram_std" },
    "Christmas": { "STARTER": "xmas_std", "PREMIUM": "xmas_prem", "ULTIMATE": "xmas_ult" },
    "Birthdays": { "STARTER": "bday_std", "PREMIUM": "bday_prem" },
    "Valentine's Day": { "STARTER": "val_std", "PREMIUM": "val_prem" },
    "Halloween": { "STARTER": "hal_std", "PREMIUM": "hal_prem" }
};

function getId(holiday, tier, idx) {
    if (specialIds[holiday] && specialIds[holiday][tier]) {
        return `${specialIds[holiday][tier]}_${idx}`;
    }
    // generic id
    return `${holiday.replace(/[^a-z0-9]/gi, '').toLowerCase()}_${tier.toLowerCase()}_${idx}`;
}

async function generateImages() {
    const rawData = fs.readFileSync(path.join(__dirname, "scratch_prompts_parsed.json"));
    let dataStr = rawData.toString("utf8");
    if (dataStr.includes('\0')) dataStr = rawData.toString("utf16le");
    if (dataStr.charCodeAt(0) === 0xFEFF) dataStr = dataStr.slice(1);
    const data = JSON.parse(dataStr);
    
    const outputDir = path.join(process.env.APPDATA || process.env.HOME || "", ".gemini", "antigravity-cli", "brain", "d3bb25bf-0354-48de-9164-576917d3a990");
    
    const existingImages = {
        "ny_std_2": "ny_std_2_1785549967768.jpg",
        "ny_std_3": "ny_std_3_1785549974882.jpg",
        "ny_std_4": "ny_std_4_1785549983568.jpg",
        "ny_prem_2": "ny_prem_2_1785549992310.jpg",
        "ny_prem_3": "ny_prem_3_1785550000463.jpg",
        "ny_prem_4": "ny_prem_4_1785550008000.jpg",
        "ram_std_2": "ram_std_2_1785550047734.jpg"
    };

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 800, height: 800 });

    for (const [holiday, tiers] of Object.entries(data)) {
        for (const [tier, prompts] of Object.entries(tiers)) {
            // We only need photos 2, 3, 4 which correspond to index 1, 2, 3 in the array 
            // Actually the array has 5 strings, index 0 = Photo 1, index 1 = Photo 2, etc.
            for (let i = 2; i <= 4; i++) {
                const promptIdx = i - 1;
                if (!prompts[promptIdx]) continue;
                
                const id = getId(holiday, tier, i);
                const description = prompts[promptIdx].substring(0, 300) + "..."; // truncate for display
                
                if (existingImages[id]) {
                    console.log(`Skipping ${id}, already generated.`);
                    continue;
                }

                console.log(`Generating placeholder for ${id}...`);
                const htmlContent = `
                    <html>
                    <body style="margin:0; padding:40px; background:linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; text-align:center; color:#4a1259; box-sizing:border-box;">
                        <div style="background:white; padding:40px; border-radius:24px; box-shadow:0 24px 56px rgba(155,47,201,0.12); border:1px solid rgba(155,47,201,0.2); width:100%; height:100%; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-size:16px; text-transform:uppercase; letter-spacing:0.1em; color:#9b2fc9; font-weight:bold; margin-bottom:16px;">
                                ${holiday} - ${tier} - Photo ${i}
                            </div>
                            <div style="font-size:24px; font-weight:800; margin-bottom:24px; color:#1a0b2e;">
                                ${id}
                            </div>
                            <div style="font-size:18px; line-height:1.6; color:#5b4a6b;">
                                ${description}
                            </div>
                            <div style="margin-top:auto; font-size:14px; color:#a0a0a0;">
                                (Auto-generated placeholder)
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                
                await page.setContent(htmlContent);
                const outputPath = path.join(outputDir, `${id}_placeholder.jpg`);
                await page.screenshot({ path: outputPath, type: "jpeg", quality: 90 });
                console.log(`Saved ${outputPath}`);
            }
        }
    }

    await browser.close();
    console.log("All placeholders generated.");
}

generateImages().catch(console.error);
