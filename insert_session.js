const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require' });
pool.query("INSERT INTO session (id, \"expiresAt\", token, \"createdAt\", \"updatedAt\", \"ipAddress\", \"userAgent\", \"userId\") VALUES ('super_agent_session_1', '2027-01-01T00:00:00.000Z', 'super_agent_token_xyz123', NOW(), NOW(), '127.0.0.1', 'agent', 'ybLNA496XAdbD8mwszg4UyJ32O8N79ZE')").then(res => {
    console.log('Session inserted!');
    pool.end();
}).catch(console.error);
