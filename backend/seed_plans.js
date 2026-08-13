const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
    const sql = fs.readFileSync('prisma/seed/plans.sql', 'utf8');
    await pool.query(sql);
    console.log('Seeded plans');
}

run().catch(console.error).finally(() => pool.end());
