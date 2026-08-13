
const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  await client.query("UPDATE \"User\" SET \"emailVerified\" = true WHERE email = $1", ['test_edd18b33@celebrease.com']);
  await client.end();
}
main().catch(console.error);
