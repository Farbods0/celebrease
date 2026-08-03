const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');

(async () => {
    console.log('🚀 DEPLOYING GENDER REVEALS ANGLE 1 AI PHOTO ASSET...\n');

    const sourceFile = 'C:\\Users\\farbo\\.gemini\\antigravity-cli\\brain\\d8b9f463-caf4-41f7-9db1-e44414633abc\\gender_reveals_angle1_1785782015287.jpg';
    
    const frontendDest = 'C:\\Users\\farbo\\Documents\\celebrease\\frontend\\public\\uploads\\holidays\\gender-reveals-starter-angle1.jpg';
    const backendDest = 'C:\\Users\\farbo\\Documents\\celebrease\\backend\\uploads\\holidays\\gender-reveals-starter-angle1.jpg';

    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, frontendDest);
        fs.copyFileSync(sourceFile, backendDest);
        console.log(`✅ Copied ${sourceFile} to public/uploads/holidays/gender-reveals-starter-angle1.jpg`);
    } else {
        console.error('Source file not found!');
        return;
    }

    // Update database
    const relPath = '/uploads/holidays/gender-reveals-starter-angle1.jpg';
    const kitImages = [
        '/uploads/holidays/gender-reveals-starter-angle1.jpg',
        '/uploads/holidays/gender-reveals.jpg',
        '/uploads/holidays/gender-reveals-premium-angle1.jpg',
        '/uploads/holidays/gender-reveals-ultimate-angle1.jpg'
    ];

    await sql`UPDATE "holiday" SET image = ${relPath} WHERE name ILIKE '%Gender%';`;
    console.log('✅ Updated "holiday" table for Gender Reveals');

    await sql`UPDATE "kit" SET images = ${kitImages} WHERE "holidayId" IN (SELECT id FROM "holiday" WHERE name ILIKE '%Gender%');`;
    console.log('✅ Updated "kit" table images array for Gender Reveals');

})();
