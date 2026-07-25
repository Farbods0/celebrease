const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
    const sql = fs.readFileSync('prisma/seed/plans.sql', 'utf8');
    await pool.query(sql);
    console.log('Seeded plans');
}

run().catch(console.error).finally(() => pool.end());
