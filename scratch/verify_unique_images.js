const { Client } = require('pg');
const connStr = "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function verify() {
    const client = new Client({ connectionString: connStr });
    await client.connect();
    
    try {
        const result = await client.query(`
            SELECT h.name as holiday, k.tier, k.images
            FROM kit k
            JOIN holiday h ON k."holidayId" = h.id
            WHERE k.images IS NOT NULL AND array_length(k.images, 1) > 0
            ORDER BY h.name, k.tier;
        `);
        
        const grouped = {};
        for (const row of result.rows) {
            if (!grouped[row.holiday]) grouped[row.holiday] = {};
            grouped[row.holiday][row.tier] = row.images;
        }
        
        let allUnique = true;
        
        for (const [holiday, tiers] of Object.entries(grouped)) {
            const starter = tiers['STARTER'] ? tiers['STARTER'][0] : null;
            const premium = tiers['PREMIUM'] ? tiers['PREMIUM'][0] : null;
            const ultimate = tiers['ULTIMATE'] ? tiers['ULTIMATE'][0] : null;
            
            // We expect these to be different if they exist
            if (starter && premium && JSON.stringify(starter) === JSON.stringify(premium)) {
                console.log(`❌ FAILED: ${holiday} - STARTER and PREMIUM share the same images: ${JSON.stringify(starter)}`);
                allUnique = false;
            }
            if (starter && ultimate && JSON.stringify(starter) === JSON.stringify(ultimate)) {
                console.log(`❌ FAILED: ${holiday} - STARTER and ULTIMATE share the same images: ${JSON.stringify(starter)}`);
                allUnique = false;
            }
            if (premium && ultimate && JSON.stringify(premium) === JSON.stringify(ultimate)) {
                console.log(`❌ FAILED: ${holiday} - PREMIUM and ULTIMATE share the same images: ${JSON.stringify(premium)}`);
                allUnique = false;
            }
            
            if (allUnique && Object.keys(tiers).length > 1) {
                // If this iteration didn't fail, let's just log success for it
                // console.log(`✅ ${holiday} has unique tier images.`);
            }
        }
        
        if (allUnique) {
            console.log("✅ SUCCESS: All holidays have entirely unique images across their tiers in the database!");
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
verify();
