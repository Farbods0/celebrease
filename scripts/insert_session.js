const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("INSERT INTO session (id, \"expiresAt\", token, \"createdAt\", \"updatedAt\", \"ipAddress\", \"userAgent\", \"userId\") VALUES ('super_agent_session_1', '2027-01-01T00:00:00.000Z', 'super_agent_token_xyz123', NOW(), NOW(), '127.0.0.1', 'agent', 'ybLNA496XAdbD8mwszg4UyJ32O8N79ZE')").then(res => {
    console.log('Session inserted!');
    pool.end();
}).catch(console.error);
