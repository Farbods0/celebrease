const fs = require('fs');

const kits = [
    { name: "Christmas", slug: "christmas", tiers: ["STARTER", "PREMIUM", "ULTIMATE"] },
    { name: "Gender Reveals", slug: "gender-reveals", tiers: ["STARTER", "PREMIUM", "ULTIMATE"] },
    { name: "Weddings & Rehearsal Dinners", slug: "weddings-rehearsal-dinners", tiers: ["STARTER", "PREMIUM", "ULTIMATE"] },
    { name: "Baby Showers", slug: "baby-showers", tiers: ["STARTER", "PREMIUM"] },
    { name: "Birthdays", slug: "birthdays", tiers: ["STARTER", "PREMIUM"] },
    { name: "Diwali", slug: "diwali", tiers: ["STARTER", "PREMIUM"] },
    { name: "Easter", slug: "easter", tiers: ["STARTER", "PREMIUM"] },
    { name: "Eid", slug: "eid", tiers: ["STARTER", "PREMIUM"] },
    { name: "Engagement Parties", slug: "engagement-parties", tiers: ["STARTER", "PREMIUM"] },
    { name: "Halloween", slug: "halloween", tiers: ["STARTER", "PREMIUM"] },
    { name: "Hanukkah", slug: "hanukkah", tiers: ["STARTER", "PREMIUM"] },
    { name: "New Year's", slug: "new-years", tiers: ["STARTER", "PREMIUM"] },
    { name: "Nowruz", slug: "nowruz", tiers: ["STARTER", "PREMIUM"] },
    { name: "Ramadan", slug: "ramadan", tiers: ["STARTER", "PREMIUM"] },
    { name: "Valentine's Day", slug: "valentines-day", tiers: ["STARTER", "PREMIUM"] },
    { name: "St. Patrick's Day", slug: "st-patricks-day", tiers: ["ULTIMATE"] },
    { name: "Thanksgiving", slug: "thanksgiving", tiers: ["PREMIUM", "ULTIMATE"] }
];

const plan = [];
let sql = "";

for (const kit of kits) {
    for (const tier of kit.tiers) {
        const imagePaths = [];
        for (let angle = 1; angle <= 4; angle++) {
            const fileName = `${kit.slug}_${tier.toLowerCase()}_angle${angle}`;
            const publicPath = `/uploads/holidays/${fileName}.jpg`;
            imagePaths.push(`"${publicPath}"`);
            
            // Customize prompt based on tier
            let tierDesc = "";
            if (tier === "STARTER") tierDesc = "a basic starter collection with essential decorations";
            if (tier === "PREMIUM") tierDesc = "a premium upgraded collection with abundant, high-quality festive decorations";
            if (tier === "ULTIMATE") tierDesc = "the ultimate luxury collection with extravagant, massive decorative displays";
            
            plan.push({
                holiday: kit.name,
                tier: tier,
                angle: angle,
                imageName: fileName,
                prompt: `Professional high-end product photography of a ${kit.name} celebration decoration kit in a beautifully lit modern home. This is ${tierDesc}. Studio lighting, cinematic composition, depth of field, 8k resolution, photorealistic. Angle ${angle}.`
            });
        }
        // PostgreSQL array format: '{"/uploads/holidays/...", ...}'
        const arrayStr = `'{${imagePaths.join(',')}}'`;
        
        sql += `UPDATE "Kit" SET "images" = ${arrayStr} WHERE "tier" = '${tier}' AND "holidayId" = (SELECT "id" FROM "Holiday" WHERE "name" = '${kit.name.replace(/'/g, "''")}');\n`;
    }
}

fs.writeFileSync('scratch/image_generation_plan.json', JSON.stringify(plan, null, 2));
fs.writeFileSync('scratch/update_kit_images.sql', sql);
console.log(`Generated plan with ${plan.length} images and SQL script.`);
