const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    return `${holiday.replace(/[^a-z0-9]/gi, '').toLowerCase()}_${tier.toLowerCase()}_${idx}`;
}

async function uploadFile(filePath) {
    console.log(`Uploading ${filePath}...`);
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', blob, path.basename(filePath));

    const response = await fetch('https://celebrease-backend-production-4778.up.railway.app/upload?folder=holidays', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Uploaded! URL: ${data.url}`);
    return data.url;
}

async function main() {
    const rawData = fs.readFileSync(path.join(__dirname, 'scratch_prompts_parsed.json'));
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

    const kits = await prisma.kit.findMany({ include: { holiday: true } });

    for (const [holidayName, tiers] of Object.entries(data)) {
        for (const [tierName, prompts] of Object.entries(tiers)) {
            // tierName might be "STARTER", "PREMIUM", "ULTIMATE"
            let dbTier = tierName === "ULTIMATE" ? "ULTIMATE" : tierName; 
            // In Prisma schema it's KitTier enum: STARTER, PREMIUM
            // Wait, does ULTIMATE exist in schema? Let's check kits table matching.
            const kit = kits.find(k => k.holiday.name === holidayName && k.tier === dbTier);
            if (!kit) {
                console.log(`Kit not found for ${holidayName} - ${dbTier}`);
                continue;
            }

            const images = [...kit.images];
            
            for (let i = 2; i <= 4; i++) {
                const id = getId(holidayName, tierName, i);
                let fileName = existingImages[id] || `${id}_placeholder.jpg`;
                let filePath = path.join(outputDir, fileName);
                
                if (fs.existsSync(filePath)) {
                    const uploadedUrl = await uploadFile(filePath);
                    images[i - 1] = uploadedUrl;
                } else {
                    console.log(`File not found: ${filePath}`);
                }
            }

            console.log(`Updating kit ${kit.id} with new images...`);
            await prisma.kit.update({
                where: { id: kit.id },
                data: { images }
            });
            console.log(`Updated kit ${kit.id}`);
        }
    }
    
    console.log("All kits updated.");

    const revalidateUrls = [
        "https://celebrease.com/api/revalidate?secret=celebrease-revalidate-2026&path=/catalog",
        "https://celebrease.com/api/revalidate?secret=celebrease-revalidate-2026&path=/"
    ];
    
    const uniqueHolidays = [...new Set(kits.map(k => k.holidayId))];
    for (const hId of uniqueHolidays) {
        revalidateUrls.push(`https://celebrease.com/api/revalidate?secret=celebrease-revalidate-2026&path=/catalog/${hId}`);
    }

    for (const url of revalidateUrls) {
        console.log(`Revalidating: ${url}`);
        await fetch(url).catch(e => console.log(`Failed to revalidate ${url}:`, e.message));
    }

    console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
