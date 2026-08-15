const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const transcriptPath = `C:\\Users\\farbo\\.gemini\\antigravity-cli\\brain\\6b9648e8-caf9-4e38-9155-b876cf9cc475\\.system_generated\\logs\\transcript.jsonl`;
const uploadsDir = `C:\\Users\\farbo\\Documents\\celebrease\\frontend\\public\\uploads\\holidays`;
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;

async function main() {
    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
    
    const results = [];
    
    for (const line of lines) {
        try {
            const entry = JSON.parse(line);
            if (entry.type === 'SYSTEM_MESSAGE' && entry.content && entry.content.includes('[Message] timestamp=')) {
                // Remove everything before the JSON part. The content usually starts with JSON, or has ```json
                let jsonStr = null;
                const match1 = entry.content.match(/```json\n([\s\S]*?)\n```/);
                const match2 = entry.content.match(/content=(\{[\s\S]*\})\n<\/SYSTEM_MESSAGE>/);
                if (match1) {
                    jsonStr = match1[1];
                } else if (match2) {
                    jsonStr = match2[1];
                }
                
                if (jsonStr) {
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.holiday && data.tier && Array.isArray(data.images) && data.images.length === 4) {
                            if (!data.images[0].toLowerCase().includes('error')) {
                                results.push(data);
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        } catch (e) {
            // ignore bad line
        }
    }
    
    console.log(`Found ${results.length} successful holiday generations.`);
    
    if (results.length === 0) return;

    const pool = new Pool({ connectionString: dbUrl });
    
    for (const res of results) {
        console.log(`Processing ${res.holiday} - ${res.tier}`);
        const holidaySlug = res.holiday.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const tierSlug = res.tier.toLowerCase();
        
        const newImages = [];
        let i = 1;
        for (let imgPath of res.images) {
            imgPath = imgPath.replace(/\\/g, '/'); // normalize slashes
            if (fs.existsSync(imgPath)) {
                const ext = path.extname(imgPath) || '.png';
                const newName = `${holidaySlug}-${tierSlug}-angle${i}${ext}`;
                const destPath = path.join(uploadsDir, newName);
                fs.copyFileSync(imgPath, destPath);
                newImages.push(`/uploads/holidays/${newName}`);
                i++;
            } else {
                console.log(`File not found: ${imgPath}`);
            }
        }
        
        if (newImages.length === 4) {
            const query = `
                UPDATE kit 
                SET images = $1 
                WHERE tier = $2 AND "holidayId" = (SELECT id FROM holiday WHERE name = $3 LIMIT 1)
            `;
            await pool.query(query, [JSON.stringify(newImages), res.tier, res.holiday]);
            console.log(`Updated DB for ${res.holiday} - ${res.tier}`);
        } else {
            console.log(`Skipping DB update for ${res.holiday} - ${res.tier}, only got ${newImages.length} images.`);
        }
    }
    
    await pool.end();
}

main().catch(console.error);
