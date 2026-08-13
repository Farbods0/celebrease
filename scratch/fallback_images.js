const fs = require('fs');
const { Client } = require('pg');
const connStr = "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function apply() {
    const client = new Client({ connectionString: connStr });
    await client.connect();
    
    try {
        const plan = JSON.parse(fs.readFileSync('scratch/image_generation_plan.json', 'utf8'));
        
        // Find unique holidays in the plan
        const holidays = [...new Set(plan.map(p => p.holiday))];
        
        for (const hol of holidays) {
            console.log("Falling back images for", hol);
            await client.query(`
                UPDATE "kit" k1
                SET images = k2.images
                FROM "kit" k2, "holiday" h
                WHERE k1."holidayId" = h.id 
                  AND k2."holidayId" = h.id
                  AND h.name = $1
                  AND k2.tier = 'STARTER'
                  AND k1.tier IN ('PREMIUM', 'ULTIMATE')
            `, [hol]);
        }
        
        console.log("Successfully duplicated STARTER images to PREMIUM/ULTIMATE temporarily!");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await client.end();
    }
}
apply();
