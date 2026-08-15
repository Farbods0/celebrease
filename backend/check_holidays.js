const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);
sql`SELECT id, name, "sortOrder", image FROM holiday WHERE "isActive" = true ORDER BY "sortOrder" ASC, name ASC LIMIT 20`
  .then(r => { console.log(r); process.exit(0); })
  .catch(console.error);
