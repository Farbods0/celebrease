const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);
sql`SELECT id, name, image FROM holiday WHERE name='Graduations' OR name='Christmas'`
  .then(r => { console.log(r); process.exit(0); })
  .catch(console.error);
