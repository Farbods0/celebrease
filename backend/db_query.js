const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_u4oIK1zMskJd@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  const res = await client.query(`SELECT id, name FROM holiday WHERE name ILIKE '%engage%'`);
  console.log(res.rows);
  await client.end();
}
run();
