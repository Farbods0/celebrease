
const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
  });
  await client.connect();
  await client.query("UPDATE \"User\" SET \"emailVerified\" = true WHERE email = $1", ['test_edd18b33@celebrease.com']);
  await client.end();
}
main().catch(console.error);
