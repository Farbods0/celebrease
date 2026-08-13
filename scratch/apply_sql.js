const fs = require('fs');
const { Client } = require('pg');

const connStr = "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function apply() {
    const client = new Client({ connectionString: connStr });
    await client.connect();
    
    try {
        console.log("Connected to Neon DB. Reading SQL file...");
        const sql = fs.readFileSync('scratch/update_kit_images.sql', 'utf8');
        
        console.log("Executing SQL...");
        await client.query(sql);
        console.log("SQL executed successfully! DB is updated.");
        
    } catch (e) {
        console.error("Error executing SQL:", e);
    } finally {
        await client.end();
    }
}

apply();
