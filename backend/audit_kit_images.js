const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');
(async () => {
    // Fix St Patrick's Day STARTER - files on disk use st-patricks-day (no apostrophe)
    const images = [
        '/uploads/holidays/st-patricks-day-starter-angle1.jpg',
        '/uploads/holidays/st-patricks-day-starter-angle2.jpg',
        '/uploads/holidays/st-patricks-day-starter-angle3.jpg',
        '/uploads/holidays/st-patricks-day-starter-angle4.jpg'
    ];
    const res = await sql`
        UPDATE kit SET images = ${images}
        FROM holiday
        WHERE kit."holidayId" = holiday.id
          AND holiday.name = 'St. Patrick''s Day'
          AND kit.tier = 'STARTER'
        RETURNING kit.id
    `;
    console.log('St Patricks Day STARTER updated:', res.length, 'rows');
})();
